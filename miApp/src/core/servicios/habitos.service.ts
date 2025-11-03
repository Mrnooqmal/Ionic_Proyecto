import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseMysqlService } from './base_mysql.service';

export interface Habito {
  idHabito: number;
  habito: string;
  descripcion?: string;
  idPaciente: number;
}

@Injectable({
  providedIn: 'root'
})
export class HabitosService extends BaseMysqlService {
  private habitosSubject = new BehaviorSubject<Habito[]>([]);
  habitos$ = this.habitosSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.cargarHabitosIniciales();
  }

  private cargarHabitosIniciales() {
    this.get<Habito[]>('habitos').subscribe({
      next: (habitos) => this.habitosSubject.next(habitos),
      error: (error) => console.error('Error al cargar hábitos:', error)
    });
  }

  getHabitos(): Observable<Habito[]> {
    return this.habitos$;
  }

  crearHabito(habito: Omit<Habito, 'idHabito'>): Observable<Habito> {
    return new Observable(observer => {
      this.post<Habito>('habitos', habito).subscribe({
        next: (nuevo) => {
          const actuales = this.habitosSubject.getValue();
          this.habitosSubject.next([...actuales, nuevo]);
          observer.next(nuevo);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  actualizarHabito(id: number, cambios: Partial<Habito>): Observable<Habito> {
    return this.put<Habito>(`habitos/${id}`, cambios);
  }

  eliminarHabito(id: number): Observable<void> {
    return this.delete<void>(`habitos/${id}`);
  }
}
