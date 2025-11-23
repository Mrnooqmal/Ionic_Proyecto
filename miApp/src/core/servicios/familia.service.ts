import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';
import { Paciente } from './pacientes.service';

export type TipoRelacion = 'padre' | 'madre' | 'hijo' | 'hija' | 'conyuge' | 'hermano' | 'hermana' | 'abuelo' | 'abuela' | 'otro';

/**
 * Miembro del grupo familiar con información de relación
 */
export interface MiembroFamilia {
  idPaciente: number;
  paciente: Paciente;
  rolFamiliar: TipoRelacion;
  puedeVerFicha: boolean;
  puedeEditarFicha: boolean;
  puedeAgregarDatos: boolean;
  relacion: {
    conPacienteId: number;
    tipo: TipoRelacion;
  };
  agregadoEn: string;
}

/**
 * Grupo familiar completo
 */
export interface GrupoFamiliar {
  idPrincipal: number;
  miembros: MiembroFamilia[];
  totalMiembros: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Invitación a un grupo familiar
 */
export interface InvitacionFamilia {
  idInvitacion: number;
  idRemitente: number;
  idDestinatario: number;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  tipoRelacion: TipoRelacion;
  mensaje?: string;
  created_at?: string;
  respondidoEn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FamiliaService extends BaseMysqlService {
  private grupoFamiliarSubject = new BehaviorSubject<GrupoFamiliar | null>(null);
  grupoFamiliar$ = this.grupoFamiliarSubject.asObservable();

  private invitacionesSubject = new BehaviorSubject<InvitacionFamilia[]>([]);
  invitaciones$ = this.invitacionesSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Obtiene el grupo familiar de un paciente
   */
  getGrupoFamiliar(pacienteId: number): Observable<GrupoFamiliar> {
    return this.get<any>(`patients/${pacienteId}/family-group`).pipe(
      map(resp => resp?.data ?? resp),
      tap((grupo: GrupoFamiliar) => {
        this.grupoFamiliarSubject.next(grupo);
      }),
      catchError(err => {
        console.warn(`No se encontró grupo familiar para paciente ${pacienteId}:`, err);
        // Devolver un grupo vacío si no existe
        const grupoVacio: GrupoFamiliar = {
          idPrincipal: pacienteId,
          miembros: [],
          totalMiembros: 0
        };
        this.grupoFamiliarSubject.next(grupoVacio);
        return of(grupoVacio);
      })
    );
  }

  /**
   * Obtiene el grupo familiar actual (del BehaviorSubject)
   */
  getGrupoFamiliarActual(): GrupoFamiliar | null {
    return this.grupoFamiliarSubject.value;
  }

  /**
   * Agrega un miembro a la familia
   */
  agregarMiembroFamilia(
    pacienteId: number,
    nuevoMiembroId: number,
    relacion: TipoRelacion
  ): Observable<MiembroFamilia> {
    return this.post<any>(`patients/${pacienteId}/family-members`, {
      idPacienteNuevo: nuevoMiembroId,
      tipoRelacion: relacion,
      puedeVerFicha: true,
      puedeEditarFicha: false,
      puedeAgregarDatos: false
    }).pipe(
      map(resp => resp?.data ?? resp),
      tap((nuevoMiembro: MiembroFamilia) => {
        const grupoActual = this.grupoFamiliarSubject.value;
        if (grupoActual) {
          grupoActual.miembros.push(nuevoMiembro);
          grupoActual.totalMiembros = grupoActual.miembros.length;
          this.grupoFamiliarSubject.next({ ...grupoActual });
        }
      }),
      catchError(err => {
        console.error('Error agregando miembro familia:', err);
        throw err;
      })
    );
  }

  /**
   * Envía una invitación a otro paciente para unirse a la familia
   */
  enviarInvitacionFamilia(
    pacienteIdRemitente: number,
    emailDestinatario: string,
    tipoRelacion: TipoRelacion,
    mensaje?: string
  ): Observable<InvitacionFamilia> {
    return this.post<any>(`patients/${pacienteIdRemitente}/family-invitations`, {
      emailDestinatario,
      tipoRelacion,
      mensaje
    }).pipe(
      map(resp => resp?.data ?? resp),
      tap((invitacion: InvitacionFamilia) => {
        const invitacionesActuales = this.invitacionesSubject.value;
        this.invitacionesSubject.next([...invitacionesActuales, invitacion]);
      }),
      catchError(err => {
        console.error('Error enviando invitación:', err);
        throw err;
      })
    );
  }

  /**
   * Obtiene las invitaciones pendientes de un paciente
   */
  getInvitacionesPendientes(pacienteId: number): Observable<InvitacionFamilia[]> {
    return this.get<any>(`patients/${pacienteId}/family-invitations/pending`).pipe(
      map(resp => resp?.data ?? resp ?? []),
      tap((invitaciones: InvitacionFamilia[]) => {
        this.invitacionesSubject.next(invitaciones);
      }),
      catchError(err => {
        console.warn(`No se pudieron obtener invitaciones para ${pacienteId}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Acepta una invitación a un grupo familiar
   */
  aceptarInvitacionFamilia(invitacionId: number): Observable<GrupoFamiliar> {
    return this.post<any>(`family-invitations/${invitacionId}/accept`, {}).pipe(
      map(resp => resp?.data ?? resp),
      tap((grupo: GrupoFamiliar) => {
        this.grupoFamiliarSubject.next(grupo);
      }),
      catchError(err => {
        console.error('Error aceptando invitación:', err);
        throw err;
      })
    );
  }

  /**
   * Rechaza una invitación a un grupo familiar
   */
  rechazarInvitacionFamilia(invitacionId: number): Observable<void> {
    return this.post<any>(`family-invitations/${invitacionId}/reject`, {}).pipe(
      map(() => void 0),
      tap(() => {
        const invitacionesActuales = this.invitacionesSubject.value;
        this.invitacionesSubject.next(
          invitacionesActuales.filter(i => i.idInvitacion !== invitacionId)
        );
      }),
      catchError(err => {
        console.error('Error rechazando invitación:', err);
        throw err;
      })
    );
  }

  /**
   * Actualiza los permisos de un miembro de la familia
   */
  actualizarPermisosMiembroFamilia(
    pacienteIdPrincipal: number,
    pacienteIdMiembro: number,
    permisos: {
      puedeVerFicha?: boolean;
      puedeEditarFicha?: boolean;
      puedeAgregarDatos?: boolean;
    }
  ): Observable<MiembroFamilia> {
    return this.put<any>(
      `patients/${pacienteIdPrincipal}/family-members/${pacienteIdMiembro}/permissions`,
      permisos
    ).pipe(
      map(resp => resp?.data ?? resp),
      tap((miembroActualizado: MiembroFamilia) => {
        const grupoActual = this.grupoFamiliarSubject.value;
        if (grupoActual) {
          const idx = grupoActual.miembros.findIndex(m => m.idPaciente === pacienteIdMiembro);
          if (idx !== -1) {
            grupoActual.miembros[idx] = miembroActualizado;
            this.grupoFamiliarSubject.next({ ...grupoActual });
          }
        }
      }),
      catchError(err => {
        console.error('Error actualizando permisos:', err);
        throw err;
      })
    );
  }

  /**
   * Elimina un miembro de la familia
   */
  eliminarMiembroFamilia(
    pacienteIdPrincipal: number,
    pacienteIdMiembro: number
  ): Observable<void> {
    return this.delete<any>(
      `patients/${pacienteIdPrincipal}/family-members/${pacienteIdMiembro}`
    ).pipe(
      map(() => void 0),
      tap(() => {
        const grupoActual = this.grupoFamiliarSubject.value;
        if (grupoActual) {
          grupoActual.miembros = grupoActual.miembros.filter(m => m.idPaciente !== pacienteIdMiembro);
          grupoActual.totalMiembros = grupoActual.miembros.length;
          this.grupoFamiliarSubject.next({ ...grupoActual });
        }
      }),
      catchError(err => {
        console.error('Error eliminando miembro:', err);
        throw err;
      })
    );
  }

  /**
   * Verifica si un paciente puede ver la ficha de otro
   */
  puedeVerFicha(pacienteId: number, miembroId: number): boolean {
    const grupo = this.grupoFamiliarSubject.value;
    if (!grupo) return pacienteId === miembroId; // Solo puede ver su propia ficha

    const miembro = grupo.miembros.find(m => m.idPaciente === miembroId);
    return miembro?.puedeVerFicha ?? false;
  }

  /**
   * Verifica si un paciente puede editar la ficha de otro
   */
  puedeEditarFicha(pacienteId: number, miembroId: number): boolean {
    if (pacienteId === miembroId) return true; // Siempre puede editar la suya propia

    const grupo = this.grupoFamiliarSubject.value;
    if (!grupo) return false;

    const miembro = grupo.miembros.find(m => m.idPaciente === miembroId);
    return miembro?.puedeEditarFicha ?? false;
  }

  /**
   * Obtiene todos los miembros que pueden ver el paciente especificado
   */
  getMiembrosQueVenAlPaciente(pacienteId: number): MiembroFamilia[] {
    const grupo = this.grupoFamiliarSubject.value;
    if (!grupo) return [];

    return grupo.miembros.filter(m => m.puedeVerFicha);
  }
}
