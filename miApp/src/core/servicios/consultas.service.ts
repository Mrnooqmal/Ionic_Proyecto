import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseMysqlService } from './base_mysql.service';

export interface Consulta {
  idConsulta: number;
  motivo: string;
  fechaIngreso: string;
  diagnostico?: string;
  profesional?: string;
  idPaciente: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService extends BaseMysqlService {
  private consultasSubject = new BehaviorSubject<Consulta[]>([]);
  consultas$ = this.consultasSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.cargarConsultasIniciales();
  }

  private cargarConsultasIniciales() {
    this.get<Consulta[]>('consultas').subscribe({
      next: (consultas) => this.consultasSubject.next(consultas),
      error: (error) => console.error('Error al cargar consultas:', error)
    });
  }

  getConsultas(): Observable<Consulta[]> {
    return this.consultas$;
  }

  crearConsulta(consulta: Omit<Consulta, 'idConsulta'>): Observable<Consulta> {
    return new Observable(observer => {
      this.post<Consulta>('consultas', consulta).subscribe({
        next: (nuevaConsulta) => {
          const actuales = this.consultasSubject.getValue();
          this.consultasSubject.next([...actuales, nuevaConsulta]);
          observer.next(nuevaConsulta);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  actualizarConsulta(id: number, cambios: Partial<Consulta>): Observable<Consulta> {
    return this.put<Consulta>(`consultas/${id}`, cambios);
  }

  eliminarConsulta(id: number): Observable<void> {
    return this.delete<void>(`consultas/${id}`);
  }
}
