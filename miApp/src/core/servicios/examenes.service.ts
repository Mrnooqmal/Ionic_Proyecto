import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface ResultadoExamen {
  parametro: string;
  valor: string;
  unidad: string;
  valorNormal: string;
  estado: 'normal' | 'bajo' | 'alto';
}

export interface Examen {
  idExamen: number;
  idPaciente: number;
  idConsulta?: number;
  nombreExamen?: string;
  tipoExamen: string;
  fechaExamen: string;
  laboratorio?: string;
  resultados: ResultadoExamen[];
  notas?: string;
  archivos?: string[];
  archivoTipo?: string;
  archivoFechaSubida?: string;
  archivoSize?: number;
  estado: 'pendiente' | 'completado' | 'anulado';
  created_at?: string;
  updated_at?: string;
  resultadoPrincipal?: string;
  resultadoUnidad?: string;
  referenciaInferior?: string;
  referenciaSuperior?: string;
  observacionTextract?: string;
  textractTexto?: string;
  textractCampos?: any;
  textractTablas?: any;
  textractConfianza?: number;
  textractFecha?: string;
}

// Examen básico para creación manual (sin estructura de resultados complejos todavía)
export interface ExamenBasicoCrear {
  nombreExamen: string;
  tipoExamen: string;
  unidadMedida?: string;
  valorReferencia?: string;
  idConsulta?: number; // opcional para asociar
  observacion?: string; // observación en puente ConsultaExamen
}

@Injectable({
  providedIn: 'root'
})
export class ExamenesService extends BaseMysqlService {
  private examenesSubject = new BehaviorSubject<Examen[]>([]);
  examenes$ = this.examenesSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene todos los exámenes de un paciente
   */
  getExamenesPaciente(pacienteId: number): Observable<Examen[]> {
    return this.get<any>(`patients/${pacienteId}/exams`).pipe(
      map(resp => (resp?.data ?? resp ?? []).map((raw: any) => this.adaptarExamen(raw, pacienteId))),
      tap((examenes: Examen[]) => {
        this.examenesSubject.next(examenes);
      }),
      catchError(err => {
        console.warn(`No se pudieron obtener exámenes para paciente ${pacienteId}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un examen específico
   */
  getExamenById(id: number): Observable<Examen> {
    return this.get<any>(`exams/${id}`).pipe(
      map(resp => resp?.data ?? resp),
      catchError(err => {
        console.error('Error obteniendo examen:', err);
        throw err;
      })
    );
  }

  /**
   * Crea un nuevo examen
   */
  crearExamen(pacienteId: number, examen: Omit<Examen, 'idExamen'>): Observable<Examen> {
    return this.post<any>(`patients/${pacienteId}/exams`, examen).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevoExamen: Examen) => {
        const actuales = this.examenesSubject.value;
        this.examenesSubject.next([...actuales, nuevoExamen]);
      }),
      catchError(err => {
        console.error('Error creando examen:', err);
        throw err;
      })
    );
  }

  /**
   * Crear examen básico (nombre/tipo/unidad/valorReferencia) con posible asociación a consulta
   */
  crearExamenBasico(pacienteId: number, data: ExamenBasicoCrear): Observable<any> {
    return this.post<any>(`patients/${pacienteId}/exams`, data).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevo: any) => {
        const adaptado = this.adaptarExamen(nuevo, pacienteId);
        const actuales = this.examenesSubject.value;
        this.examenesSubject.next([...actuales, adaptado]);
      }),
      catchError(err => {
        console.error('Error creando examen básico:', err);
        throw err;
      })
    );
  }

  /**
   * Actualiza un examen
   */
  actualizarExamen(id: number, cambios: Partial<Examen>): Observable<Examen> {
    return this.put<any>(`exams/${id}`, cambios).pipe(
      map(resp => resp?.data ?? resp),
      tap((examenActualizado: Examen) => {
        const actuales = this.examenesSubject.value;
        const idx = actuales.findIndex(e => e.idExamen === id);
        if (idx !== -1) {
          actuales[idx] = examenActualizado;
          this.examenesSubject.next([...actuales]);
        }
      }),
      catchError(err => {
        console.error('Error actualizando examen:', err);
        throw err;
      })
    );
  }

  /**
   * Elimina un examen
   */
  eliminarExamen(id: number): Observable<void> {
    return this.delete<any>(`exams/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        const actuales = this.examenesSubject.value;
        this.examenesSubject.next(actuales.filter(e => e.idExamen !== id));
      }),
      catchError(err => {
        console.error('Error eliminando examen:', err);
        throw err;
      })
    );
  }

  /**
   * Obtiene los exámenes pendientes
   */
  getExamenesPendientes(pacienteId: number): Observable<Examen[]> {
    return this.getExamenesPaciente(pacienteId).pipe(
      map(examenes => examenes.filter(e => e.estado === 'pendiente'))
    );
  }

  /**
   * Obtiene los exámenes más recientes
   */
  getExamenesRecientes(pacienteId: number, limite: number = 5): Observable<Examen[]> {
    return this.getExamenesPaciente(pacienteId).pipe(
      map(examenes => examenes
        .sort((a, b) => new Date(b.fechaExamen).getTime() - new Date(a.fechaExamen).getTime())
        .slice(0, limite)
      )
    );
  }

  /**
   * Descarga el archivo de un examen
   */
  /**
   * Subir archivo para un examen en una consulta
   */
  subirArchivoExamen(
    idConsulta: number,
    idExamen: number,
    archivoNombre: string,
    archivoTipo: string,
    archivoBase64: string
  ): Observable<any> {
    return this.put<any>(
      `consultations/${idConsulta}/exams/${idExamen}/upload`,
      { archivoNombre, archivoTipo, archivoBlob: archivoBase64 }
    ).pipe(
      map(resp => resp?.data ?? resp),
      catchError(err => {
        console.error('Error subiendo archivo:', err);
        throw err;
      })
    );
  }

  /**
   * Descargar archivo de un examen
   */
  descargarArchivoExamen(idConsulta: number, idExamen: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl.replace(/\/$/, '')}/consultations/${idConsulta}/exams/${idExamen}/download`,
      { responseType: 'blob' }
    );
  }

  descargarResultado(examenId: number, nombreArchivo: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl.replace(/\/$/, '')}/exams/${examenId}/download/${nombreArchivo}`,
      { responseType: 'blob' }
    );
  }

  private adaptarExamen(raw: any, pacienteId?: number): Examen {
    return {
      idExamen: raw.idExamen,
      idPaciente: pacienteId ?? raw.idPaciente ?? 0,
      idConsulta: raw.idConsulta,
      nombreExamen: raw.nombreExamen,
      tipoExamen: raw.tipoExamen || raw.nombreExamen || 'Examen',
      fechaExamen: raw.fecha || raw.fechaExamen || raw.fechaConsulta || new Date().toISOString(),
      laboratorio: raw.laboratorio || raw.motivoConsulta || raw.nombreExamen,
      resultados: raw.resultados || [],
      notas: raw.observacion || raw.notas || '',
      archivos: raw.archivoNombre ? [raw.archivoNombre] : [],
      archivoTipo: raw.archivoTipo,
      archivoFechaSubida: raw.archivoFechaSubida,
      archivoSize: raw.archivoSize,
      estado: raw.estado || 'completado',
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      resultadoPrincipal: raw.resultadoPrincipal,
      resultadoUnidad: raw.resultadoUnidad,
      referenciaInferior: raw.referenciaInferior,
      referenciaSuperior: raw.referenciaSuperior,
      observacionTextract: raw.observacionTextract,
      textractTexto: raw.textractTexto,
      textractCampos: this.parseJsonField(raw.textractCampos),
      textractTablas: this.parseJsonField(raw.textractTablas),
      textractConfianza: raw.textractConfianza,
      textractFecha: raw.textractFecha
    };
  }

  private parseJsonField<T>(valor: any): T | undefined {
    if (!valor) {
      return undefined;
    }

    if (typeof valor === 'object') {
      return valor as T;
    }

    try {
      return JSON.parse(valor) as T;
    } catch (error) {
      console.warn('No se pudo parsear el campo JSON de examen:', error);
      return undefined;
    }
  }
}
