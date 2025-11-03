import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseMysqlService } from './base_mysql.service';

export interface Receta {
  idReceta: number;
  nombreMedicamento: string;
  dosis: string;
  frecuencia: string;
  idPaciente: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecetasService extends BaseMysqlService {
  private recetasSubject = new BehaviorSubject<Receta[]>([]);
  recetas$ = this.recetasSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.cargarRecetasIniciales();
  }

  private cargarRecetasIniciales() {
    this.get<Receta[]>('recetas').subscribe({
      next: (recetas) => this.recetasSubject.next(recetas),
      error: (error) => console.error('Error al cargar recetas:', error)
    });
  }

  getRecetas(): Observable<Receta[]> {
    return this.recetas$;
  }

  crearReceta(receta: Omit<Receta, 'idReceta'>): Observable<Receta> {
    return new Observable(observer => {
      this.post<Receta>('recetas', receta).subscribe({
        next: (nueva) => {
          const actuales = this.recetasSubject.getValue();
          this.recetasSubject.next([...actuales, nueva]);
          observer.next(nueva);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  actualizarReceta(id: number, cambios: Partial<Receta>): Observable<Receta> {
    return this.put<Receta>(`recetas/${id}`, cambios);
  }

  eliminarReceta(id: number): Observable<void> {
    return this.delete<void>(`recetas/${id}`);
  }
}
