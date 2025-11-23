import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type UserRole = 'paciente' | 'doctor' | 'admin';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
  fotoPerfil?: string;
  especialidad?: string; // Para doctors
}

export interface Sesion {
  usuario: User;
  pacienteActualId?: number; // ID del paciente siendo consultado/editado
  token?: string;
  loginTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sesionSubject = new BehaviorSubject<Sesion | null>(null);
  sesion$ = this.sesionSubject.asObservable();

  constructor() {
    this.cargarSesionGuardada();
  }

  /**
   * Carga una sesión guardada en localStorage
   */
  private cargarSesionGuardada() {
    try {
      const sesionGuardada = localStorage.getItem('sesion_meditrack');
      if (sesionGuardada) {
        const sesion = JSON.parse(sesionGuardada) as Sesion;
        sesion.loginTime = new Date(sesion.loginTime);
        this.sesionSubject.next(sesion);
      }
    } catch (error) {
      console.warn('Error cargando sesión guardada:', error);
      localStorage.removeItem('sesion_meditrack');
    }
  }

  /**
   * Simula un login
   */
  login(email: string, password: string, role: UserRole = 'paciente'): Observable<Sesion> {
    // En una app real, esto sería una llamada al backend
    const usuario: User = {
      id: 1,
      nombre: email.split('@')[0],
      email,
      role,
      fotoPerfil: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      especialidad: role === 'doctor' ? 'Medicina General' : undefined
    };

    const sesion: Sesion = {
      usuario,
      pacienteActualId: 1, // Por defecto, paciente 1
      token: `token_${Date.now()}`,
      loginTime: new Date()
    };

    this.sesionSubject.next(sesion);
    localStorage.setItem('sesion_meditrack', JSON.stringify(sesion));

    return this.sesion$.pipe(
      map(s => s!),
      // take(1) para completar el observable
    );
  }

  /**
   * Logout y limpia la sesión
   */
  logout(): void {
    this.sesionSubject.next(null);
    localStorage.removeItem('sesion_meditrack');
  }

  /**
   * Obtiene el usuario actual
   */
  getUsuarioActual(): User | null {
    return this.sesionSubject.value?.usuario ?? null;
  }

  /**
   * Obtiene el paciente actual en el contexto
   */
  getPacienteActual(): number | null {
    return this.sesionSubject.value?.pacienteActualId ?? null;
  }

  /**
   * Cambia el paciente actual (útil para familia)
   */
  setPacienteActual(pacienteId: number): void {
    const sesionActual = this.sesionSubject.value;
    if (sesionActual) {
      sesionActual.pacienteActualId = pacienteId;
      this.sesionSubject.next({ ...sesionActual });
      localStorage.setItem('sesion_meditrack', JSON.stringify(sesionActual));
    }
  }

  /**
   * Verifica si hay sesión activa
   */
  estaAutenticado(): boolean {
    return this.sesionSubject.value !== null;
  }

  /**
   * Observable que emite true/false si está autenticado
   */
  estaAutenticado$(): Observable<boolean> {
    return this.sesion$.pipe(
      map(sesion => sesion !== null)
    );
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  tieneRol(rol: UserRole): boolean {
    return this.getUsuarioActual()?.role === rol;
  }

  /**
   * Observable que emite el usuario actual
   */
  getUsuarioActual$(): Observable<User | null> {
    return this.sesion$.pipe(
      map(sesion => sesion?.usuario ?? null)
    );
  }
}
