// src/app/core/servicios/pacientes.service.ts
import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface Paciente {
  idPaciente: number;
  nombrePaciente: string;
  fechaNacimiento: string;
  correo?: string | null;
  telefono: string;
  direccion: string;
  sexo: string;
  nacionalidad: string;
  ocupacion: string;
  prevision: string;
  fotoPerfil?: string;
  tipoSangre: string;
  rolFamiliar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FichaMedicaCompleta {
  paciente: Paciente;
  alergias: any[];
  habitos: any[];
  vacunas: any[];
  consultas: any[];
  medicamentos: any[];
  examenes: any[];
  diagnosticos: any[];
  procedimientos: any[];
}

export interface WsServiceLike {
  on(eventName: string): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends BaseMysqlService {
  private pacientesSubject = new BehaviorSubject<Paciente[]>([]);
  pacientes$ = this.pacientesSubject.asObservable();
  
  // Mock data para desarrollo/fallback cuando backend no disponible
  private mockPacientes: Paciente[] = [
    {
      idPaciente: 1,
      nombrePaciente: 'Juan Carlos Pérez',
      fechaNacimiento: '1985-03-15',
      correo: 'juan@example.com',
      telefono: '+56912345678',
      direccion: 'Calle Principal 123, Santiago',
      sexo: 'M',
      nacionalidad: 'Chilena',
      ocupacion: 'Ingeniero',
      prevision: 'Fonasa',
      tipoSangre: 'O+',
      fotoPerfil: undefined
    },
    {
      idPaciente: 2,
      nombrePaciente: 'María González López',
      fechaNacimiento: '1990-07-22',
      correo: 'maria@example.com',
      telefono: '+56987654321',
      direccion: 'Av. Secundaria 456, Valparaíso',
      sexo: 'F',
      nacionalidad: 'Chilena',
      ocupacion: 'Médica',
      prevision: 'Isapre',
      tipoSangre: 'A-',
      fotoPerfil: undefined
    }
  ];

  constructor(
    protected override http: HttpClient,
    @Optional() @Inject('WsServiceLike') private wsService?: WsServiceLike 
  ) {
    super(http);
    this.cargarPacientesIniciales();
    this.initRealtimeIfAvailable();
  }


  private cargarPacientesIniciales() {
    this.get<any>('pacientes')
      .pipe(
        map(resp => resp?.data ?? resp ?? []),
        catchError(err => {
          console.warn('Backend no disponible. Usando datos mock para desarrollo.', err.message);
          return of(this.mockPacientes);
        })
      )
      .subscribe((pacientes: Paciente[]) => this.pacientesSubject.next(pacientes));
  }

  private initRealtimeIfAvailable() {
    if (!this.wsService) return;

    this.wsService.on('patient.updated').pipe(
      catchError(err => {
        console.warn('WsService error:', err);
        return of(null);
      })
    ).subscribe((payload: any) => {
      if (!payload) return;
      const paciente: Paciente = payload.data ?? payload;
      if (paciente?.idPaciente) {
        this._upsertInList(paciente);
      }
    });

  }

  //helper privado para actualizar la lista local 
  private _upsertInList(paciente: Paciente) {
    const actuales = this.pacientesSubject.getValue();
    const idx = actuales.findIndex(p => p.idPaciente === paciente.idPaciente);
    if (idx === -1) {
      this.pacientesSubject.next([...actuales, paciente]);
    } else {
      const copia = [...actuales];
      copia[idx] = { ...copia[idx], ...paciente };
      this.pacientesSubject.next(copia);
    }
  }

  private _removeFromList(id: number) {
    const actuales = this.pacientesSubject.getValue();
    this.pacientesSubject.next(actuales.filter(p => p.idPaciente !== id));
  }

  //API públicas

  getPacientes(): Observable<Paciente[]> {
    return this.pacientes$;
  }

  /**
   * getPacienteById: devuelve un Observable<Paciente>.
   * Si el backend envuelve en { success, data } lo mapeamos automáticamente.
   * Si falla, intenta usar datos mock.
   */
  getPacienteById(id: number): Observable<Paciente> {
    return this.get<any>(`pacientes/${id}`).pipe(
      map(resp => resp?.data ?? resp),
      catchError(err => {
        console.warn(`No se pudo obtener paciente ${id} del backend. Buscando en mock...`, err.message);
        const mockPaciente = this.mockPacientes.find(p => p.idPaciente === id);
        if (mockPaciente) {
          return of(mockPaciente);
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * getMedicamentosReales: llama al endpoint /patients/{id}/medicines
   * y devuelve un array (response.data || response || []).
   */
  getMedicamentosReales(id: number): Observable<any[]> {
    return this.get<any>(`patients/${id}/medicines`).pipe(
      map(resp => resp?.data ?? resp ?? []),
      catchError(err => {
        console.warn(`No se pudieron obtener medicamentos para paciente ${id}`, err);
        return of([]);
      })
    );
  }

  /**
   * safeGetArray: intenta GET a un endpoint que debería devolver array;
   * si falla devuelve [] en lugar de propagar error (útil para construir ficha completa).
   */
  private safeGetArray(endpoint: string) {
    return this.get<any>(endpoint).pipe(
      map(resp => resp?.data ?? resp ?? []),
      catchError(err => {
        // Log opcional y retorno vacío
        console.debug(`safeGetArray: endpoint ${endpoint} falló, devolviendo []`, err?.status);
        return of([]);
      })
    );
  }

  /**
   * getFichaMedicaCompleta: combate llamadas en paralelo y arma la ficha.
   * Llama: paciente, medicamentos reales, y otros endpoints si existen.
   */
  getFichaMedicaCompleta(id: number): Observable<FichaMedicaCompleta> {
    return forkJoin({
      paciente: this.getPacienteById(id),
      medicamentos: this.getMedicamentosReales(id),
      alergias: this.safeGetArray(`patients/${id}/allergies`),     
      habitos: this.safeGetArray(`patients/${id}/habits`),
      vacunas: this.safeGetArray(`patients/${id}/vaccines`),
      consultas: this.safeGetArray(`patients/${id}/consultations`),
      examenes: this.safeGetArray(`patients/${id}/exams`),
      diagnosticos: this.safeGetArray(`patients/${id}/diagnostics`),
      procedimientos: this.safeGetArray(`patients/${id}/procedures`)
    }).pipe(
      map(result => {
        const ficha: FichaMedicaCompleta = {
          paciente: result.paciente,
          medicamentos: result.medicamentos ?? [],
          alergias: result.alergias ?? [],
          habitos: result.habitos ?? [],
          vacunas: result.vacunas ?? [],
          consultas: result.consultas ?? [],
          examenes: result.examenes ?? [],
          diagnosticos: result.diagnosticos ?? [],
          procedimientos: result.procedimientos ?? []
        };
        return ficha;
      })
    );
  }

  crearPaciente(paciente: Omit<Paciente, 'idPaciente'>): Observable<Paciente> {
    return this.post<any>('pacientes', paciente).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevo: Paciente) => {
        // insertamos en la lista local
        const actuales = this.pacientesSubject.getValue();
        this.pacientesSubject.next([...actuales, nuevo]);
      }),
      catchError(err => {
        console.error('Error crearPaciente:', err);
        return throwError(() => err);
      })
    );
  }

  actualizarPaciente(id: number, cambios: Partial<Paciente>): Observable<Paciente> {
    return this.put<any>(`pacientes/${id}`, cambios).pipe(
      map(resp => resp?.data ?? resp),
      tap((pacienteActualizado: Paciente) => {
        this._upsertInList(pacienteActualizado);
      }),
      catchError(err => {
        console.error('Error actualizarPaciente:', err);
        return throwError(() => err);
      })
    );
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.delete<any>(`pacientes/${id}`).pipe(
      tap(() => {
        this._removeFromList(id);
      }),
      map(() => void 0), 
      catchError(err => {
        console.error('Error eliminarPaciente:', err);
        return throwError(() => err);
      })
    );
  }
}
