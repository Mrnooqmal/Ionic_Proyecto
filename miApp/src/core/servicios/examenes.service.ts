import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseMysqlService } from './base_mysql.service';

export interface Examen {
  idExamen: number;
  nombreExamen: string;
  fecha: string;
  resultado?: string;
  valores?: string;
  idPaciente: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamenesService extends BaseMysqlService {
  private examenesSubject = new BehaviorSubject<Examen[]>([]);
  examenes$ = this.examenesSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.cargarExamenesIniciales();
  }

  private cargarExamenesIniciales() {
    this.get<Examen[]>('examenes').subscribe({
      next: (examenes) => this.examenesSubject.next(examenes),
      error: (error) => console.error('Error al cargar exámenes:', error)
    });
  }

  getExamenes(): Observable<Examen[]> {
    return this.examenes$;
  }

  crearExamen(examen: Omit<Examen, 'idExamen'>): Observable<Examen> {
    return new Observable(observer => {
      this.post<Examen>('examenes', examen).subscribe({
        next: (nuevo) => {
          const actuales = this.examenesSubject.getValue();
          this.examenesSubject.next([...actuales, nuevo]);
          observer.next(nuevo);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  actualizarExamen(id: number, cambios: Partial<Examen>): Observable<Examen> {
    return this.put<Examen>(`examenes/${id}`, cambios);
  }

  eliminarExamen(id: number): Observable<void> {
    return this.delete<void>(`examenes/${id}`);
  }
}
