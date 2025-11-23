import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface Medicamento {
  idMedicamento: number;
  nombre: string;
  principioActivo: string;
  dosis: string;
  frecuencia: string;
  viaAdministracion: string;
  indicaciones?: string;
  contraindicaciones?: string;
  efectosSecundarios?: string;
}

export interface Receta {
  idReceta: number;
  idPaciente: number;
  fechaReceta: string;
  medicamentos: Medicamento[];
  indicaciones?: string;
  doctor?: string;
  vigenciaHasta?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetasService extends BaseMysqlService {
  private recetasSubject = new BehaviorSubject<Receta[]>([]);
  recetas$ = this.recetasSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene todas las recetas de un paciente
   */
  getRecetasPaciente(pacienteId: number): Observable<Receta[]> {
    return this.get<any>(`patients/${pacienteId}/prescriptions`).pipe(
      map(resp => resp?.data ?? resp ?? []),
      tap((recetas: Receta[]) => {
        this.recetasSubject.next(recetas);
      }),
      catchError(err => {
        console.warn(`No se pudieron obtener recetas para paciente ${pacienteId}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene una receta específica
   */
  getRecetaById(id: number): Observable<Receta> {
    return this.get<any>(`prescriptions/${id}`).pipe(
      map(resp => resp?.data ?? resp),
      catchError(err => {
        console.error('Error obteniendo receta:', err);
        throw err;
      })
    );
  }

  /**
   * Crea una nueva receta
   */
  crearReceta(pacienteId: number, receta: Omit<Receta, 'idReceta'>): Observable<Receta> {
    return this.post<any>(`patients/${pacienteId}/prescriptions`, receta).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevaReceta: Receta) => {
        const actuales = this.recetasSubject.value;
        this.recetasSubject.next([...actuales, nuevaReceta]);
      }),
      catchError(err => {
        console.error('Error creando receta:', err);
        throw err;
      })
    );
  }

  /**
   * Actualiza una receta
   */
  actualizarReceta(id: number, cambios: Partial<Receta>): Observable<Receta> {
    return this.put<any>(`prescriptions/${id}`, cambios).pipe(
      map(resp => resp?.data ?? resp),
      tap((recetaActualizada: Receta) => {
        const actuales = this.recetasSubject.value;
        const idx = actuales.findIndex(r => r.idReceta === id);
        if (idx !== -1) {
          actuales[idx] = recetaActualizada;
          this.recetasSubject.next([...actuales]);
        }
      }),
      catchError(err => {
        console.error('Error actualizando receta:', err);
        throw err;
      })
    );
  }

  /**
   * Elimina una receta
   */
  eliminarReceta(id: number): Observable<void> {
    return this.delete<any>(`prescriptions/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        const actuales = this.recetasSubject.value;
        this.recetasSubject.next(actuales.filter(r => r.idReceta !== id));
      }),
      catchError(err => {
        console.error('Error eliminando receta:', err);
        throw err;
      })
    );
  }

  /**
   * Obtiene las recetas vigentes (no expiradas)
   */
  getRecetasVigentes(pacienteId: number): Observable<Receta[]> {
    return this.getRecetasPaciente(pacienteId).pipe(
      map(recetas => {
        const ahora = new Date();
        return recetas.filter(r => {
          if (!r.vigenciaHasta) return true; // Sin fecha de vencimiento = vigente
          return new Date(r.vigenciaHasta) > ahora;
        });
      })
    );
  }

  /**
   * Obtiene los medicamentos actuales activos de un paciente
   */
  getMedicamentosActivos(pacienteId: number): Observable<Medicamento[]> {
    return this.getRecetasVigentes(pacienteId).pipe(
      map(recetas => {
        const medicamentos: Medicamento[] = [];
        recetas.forEach(receta => {
          medicamentos.push(...receta.medicamentos);
        });
        // Remover duplicados por nombre
        const unicos = Array.from(new Map(
          medicamentos.map(m => [m.nombre, m])
        ).values());
        return unicos;
      })
    );
  }
}
