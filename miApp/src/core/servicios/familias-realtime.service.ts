import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FamiliaService, Familia } from './familias.service';

@Injectable({
  providedIn: 'root'
})
export class FamiliasRealtimeService {
  // Subject para notificar cambios
  private familiasChangedSubject = new Subject<{
    evento: 'actualizado' | 'eliminado' | 'creado' | 'miembro_agregado' | 'miembro_eliminado' | 'miembro_rol_actualizado';
    familia?: Familia;
    idFamilia?: number;
    idPaciente?: number;
  }>();

  public familiasChanged$ = this.familiasChangedSubject.asObservable();

  // EventSource para SSE
  private eventSource?: EventSource;
  private sseConnected = false;

  constructor(private familiaService: FamiliaService) {
    this.conectarSSE();
  }

  /**
   * Obtener familias iniciales solo - SSE manejará las actualizaciones
   */
  getFamiliasConSync(idPaciente: number): Observable<Familia[]> {
    return new Observable(observer => {
      // Carga inicial
      this.familiaService.getFamiliasPorPaciente(idPaciente).subscribe({
        next: (familias) => {
          console.log('Familias cargadas inicialmente:', familias.length);
          observer.next(familias);
        },
        error: (err) => {
          console.error('Error cargando familias:', err);
          observer.error(err);
        }
      });
    });
  }

  /**
   * Conectar a SSE para escuchar cambios en tiempo real
   */
  private conectarSSE() {
    try {
      if (this.sseConnected || this.eventSource) {
        console.log('SSE ya conectado');
        return;
      }

      console.log('Conectando a SSE en localhost:3001/api/eventos');
      this.eventSource = new EventSource('http://localhost:3001/api/eventos');

      this.eventSource.addEventListener('familia_creada', (event: any) => {
        console.log('SSE familia_creada', event.data);
        this.familiasChangedSubject.next({ evento: 'creado' });
      });

      this.eventSource.addEventListener('familia_actualizada', (event: any) => {
        console.log('SSE familia_actualizada', event.data);
        this.familiasChangedSubject.next({ evento: 'actualizado' });
      });

      this.eventSource.addEventListener('familia_eliminada', (event: any) => {
        console.log('SSE familia_eliminada', event.data);
        this.familiasChangedSubject.next({ evento: 'eliminado' });
      });

      this.eventSource.addEventListener('miembro_familia_agregado', (event: any) => {
        console.log('SSE miembro_familia_agregado', event.data);
        this.familiasChangedSubject.next({ evento: 'miembro_agregado' });
      });

      this.eventSource.addEventListener('miembro_familia_eliminado', (event: any) => {
        console.log('SSE miembro_familia_eliminado', event.data);
        this.familiasChangedSubject.next({ evento: 'miembro_eliminado' });
      });

      this.eventSource.addEventListener('miembro_familia_rol_actualizado', (event: any) => {
        console.log('SSE miembro_familia_rol_actualizado', event.data);
        this.familiasChangedSubject.next({ evento: 'miembro_rol_actualizado' });
      });

      this.eventSource.onerror = (err) => {
        console.error('Error en SSE:', err);
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.sseConnected = false;
          console.log('SSE cerrada, reconectando en 3s...');
          setTimeout(() => this.conectarSSE(), 3000);
        }
      };

      this.sseConnected = true;
      console.log('SSE conectada correctamente');
    } catch (err) {
      console.error('Error conectando SSE:', err);
      this.sseConnected = false;
    }
  }

  /**
   * Notificar que una familia fue actualizada
   */
  notifyFamiliaActualizada(familia: Familia) {
    this.familiasChangedSubject.next({
      evento: 'actualizado',
      familia
    });
  }

  /**
   * Notificar que una familia fue eliminada
   */
  notifyFamiliaEliminada(idFamilia: number, idOwner: number) {
    this.familiasChangedSubject.next({
      evento: 'eliminado',
      idFamilia
    });
  }

  /**
   * Notificar que una familia fue creada
   */
  notifyFamiliaCreada(familia: Familia) {
    this.familiasChangedSubject.next({
      evento: 'creado',
      familia
    });
  }

  /**
   * Desconectar SSE
   */
  desconectar() {
    if (this.eventSource) {
      this.eventSource.close();
      this.sseConnected = false;
      console.log('SSE desconectada');
    }
  }

  ngOnDestroy() {
    this.desconectar();
  }
}
