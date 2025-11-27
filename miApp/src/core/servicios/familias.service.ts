import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Paciente } from './pacientes.service';

export interface Familia {
  idFamilia: number;
  nombre: string;
  descripcion?: string;
  idOwner: number;
  created_at?: string;
  updated_at?: string;
  miembros?: FamiliaMiembro[];
}

export interface FamiliaMiembro {
  idFamilia: number;
  idPaciente: number;
  rol: string;
  fechaAgregado: string;
  paciente?: Paciente;
}

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  private baseUrl = `${environment.apiUrls.base}/familias`;

  constructor(private http: HttpClient) {}

  /** 
   * Obtiene todas las familias creadas por el paciente (dueño)
   * e incluye sus miembros
   */
  getFamiliasPorPaciente(idPaciente: number): Observable<Familia[]> {
    return this.http.get<any>(`${this.baseUrl}/${idPaciente}`).pipe(
      map(res => res.data || [])
    );
  }

  crearFamilia(data: { nombre: string; descripcion?: string; idOwner: number }): Observable<Familia> {
    return this.http.post<any>(this.baseUrl, data).pipe(map(res => res.data));
  }

  agregarMiembro(idFamilia: number, idPaciente: number, rol: string, idOwner?: number): Observable<any> {
    console.log('FamiliaService.agregarMiembro - Familia:', idFamilia, 'Paciente:', idPaciente, 'Rol:', rol);
    return this.http.post<any>(`${this.baseUrl}/${idFamilia}/miembros`, {
      idPaciente,
      rol
    }).pipe(
      map(res => res.data || res)
    );
  }

  actualizarRolMiembro(idFamilia: number, idPaciente: number, rol: string): Observable<any> {
    console.log('FamiliaService.actualizarRolMiembro - Familia:', idFamilia, 'Paciente:', idPaciente, 'Nuevo rol:', rol);
    return this.http.put<any>(`${this.baseUrl}/${idFamilia}/miembros/${idPaciente}`, {
      rol
    }).pipe(
      map(res => res.data || res)
    );
  }

  eliminarMiembro(idFamilia: number, idPaciente: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${idFamilia}/miembros/${idPaciente}`);
  }

  /**
   * Elimina una familia completamente
   */
  eliminarFamilia(idFamilia: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${idFamilia}`);
  }

  /**
   * Actualiza el nombre y descripción de una familia
   */
  actualizarFamilia(idFamilia: number, data: { nombre?: string; descripcion?: string }): Observable<Familia> {
    return this.http.put<any>(`${this.baseUrl}/${idFamilia}`, data).pipe(
      map(res => res.data || res)
    );
  }
}