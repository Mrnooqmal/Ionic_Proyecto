import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface Consulta {
  idConsulta: number;
  idPaciente: number;
  fechaConsulta: string;
  motivoConsulta: string;
  diagnostico?: string;
  observaciones?: string;
  proximaFecha?: string;
  doctor?: string;
  especialidad?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService extends BaseMysqlService {
  private consultasSubject = new BehaviorSubject<Consulta[]>([]);
  consultas$ = this.consultasSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene todas las consultas de un paciente
   */
  getConsultasPaciente(pacienteId: number): Observable<Consulta[]> {
    return this.get<any>(`patients/${pacienteId}/consultations`).pipe(
      map(resp => resp?.data ?? resp ?? []),
      tap((consultas: Consulta[]) => {
        this.consultasSubject.next(consultas);
      }),
      catchError(err => {
        console.warn(`No se pudieron obtener consultas para paciente ${pacienteId}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene una consulta específica
   */
  getConsultaById(id: number): Observable<Consulta> {
    return this.get<any>(`consultations/${id}`).pipe(
      map(resp => resp?.data ?? resp),
      catchError(err => {
        console.error('Error obtieniendo consulta:', err);
        throw err;
      })
    );
  }

  /**
   * Crea una nueva consulta
   */
  crearConsulta(pacienteId: number, consulta: Omit<Consulta, 'idConsulta'>): Observable<Consulta> {
    return this.post<any>(`patients/${pacienteId}/consultations`, consulta).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevaConsulta: Consulta) => {
        const actuales = this.consultasSubject.value;
        this.consultasSubject.next([...actuales, nuevaConsulta]);
      }),
      catchError(err => {
        console.error('Error creando consulta:', err);
        throw err;
      })
    );
  }

  /**
   * Actualiza una consulta
   */
  actualizarConsulta(id: number, cambios: Partial<Consulta>): Observable<Consulta> {
    return this.put<any>(`consultations/${id}`, cambios).pipe(
      map(resp => resp?.data ?? resp),
      tap((consultaActualizada: Consulta) => {
        const actuales = this.consultasSubject.value;
        const idx = actuales.findIndex(c => c.idConsulta === id);
        if (idx !== -1) {
          actuales[idx] = consultaActualizada;
          this.consultasSubject.next([...actuales]);
        }
      }),
      catchError(err => {
        console.error('Error actualizando consulta:', err);
        throw err;
      })
    );
  }

  /**
   * Elimina una consulta
   */
  eliminarConsulta(id: number): Observable<void> {
    return this.delete<any>(`consultations/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        const actuales = this.consultasSubject.value;
        this.consultasSubject.next(actuales.filter(c => c.idConsulta !== id));
      }),
      catchError(err => {
        console.error('Error eliminando consulta:', err);
        throw err;
      })
    );
  }

  /**
   * Obtiene las consultas más recientes de un paciente
   */
  getConsultasRecientes(pacienteId: number, limite: number = 5): Observable<Consulta[]> {
    return this.getConsultasPaciente(pacienteId).pipe(
      map(consultas => consultas
        .sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime())
        .slice(0, limite)
      )
    );
  }
}
