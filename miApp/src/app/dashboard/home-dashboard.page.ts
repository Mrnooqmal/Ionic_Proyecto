import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonIcon, IonChip, IonLabel,
  IonBadge, IonRefresher, IonButton,
  IonRefresherContent, IonAvatar, IonText,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, person, heart, pulse, thermometer, scale,
  calendar, medical, flask, document, alertCircle,
  trendingUp, trendingDown, checkmarkCircle,
  people, receipt, add, settings, water,
  notifications, chevronForward, time, personAdd,
  medkit, clipboard
} from 'ionicons/icons';
import { DashboardService, DashboardPacienteStats } from '../../core/servicios/dashboard.service';
import { PacientesService, Paciente } from '../../core/servicios/pacientes.service';
import { FamiliasRealtimeService } from '../../core/servicios/familias-realtime.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home-dashboard.page.html',
  styleUrls: ['./home-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton,
    IonText, IonAvatar, IonRefresherContent, IonRefresher, 
    IonContent, IonIcon, IonChip, IonLabel, IonBadge
  ]
})
export class HomeDashboardPage implements OnInit, OnDestroy {
  cargando = true;
  error = false;
  
  idPacienteActual = 1;
  usuario = {
    nombre: 'Cargando...',
    info: 'Mi panel de salud'
  };

  metricas = {
    totalConsultas: 0,
    consultasUltimos30Dias: 0,
    examenesPendientes: 0,
    medicamentosCronicos: 0
  };

  estadisticas: DashboardPacienteStats | null = null;
  private familiaRealtimeSub?: Subscription;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private pacientesService: PacientesService,
    private familiasRealtimeService: FamiliasRealtimeService
  ) {
    addIcons({ 
      home, person, heart, pulse, thermometer, scale,
      calendar, medical, flask, document, alertCircle,
      trendingUp, trendingDown, checkmarkCircle,
      people, receipt, add, settings, water,
      notifications, chevronForward, time, personAdd,
      medkit, clipboard
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.suscribirseCambiosFamilia();
  }

  async cargarDatos() {
    this.cargando = true;
    this.error = false;
    
    try {
      this.pacientesService.getPacienteById(this.idPacienteActual).subscribe({
        next: (paciente) => {
          this.usuario.nombre = paciente.nombrePaciente;
        },
        error: (err) => {
          console.warn('No se pudo obtener nombre del paciente:' , err);
        }
      });
      this.dashboardService.obtenerEstadisticasPaciente(this.idPacienteActual).subscribe({
        next: (stats) => {
          this.estadisticas = stats;
          this.metricas = stats.metricas;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando estadísticas del paciente:', err);
          this.error = true;
          this.cargando = false;
        }
      });
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.error = true;
      this.cargando = false;
    }
  }

  handleRefresh(event: any) {
    this.cargarDatos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  getUltimasConsultas() {
    if (!this.estadisticas) return [];
    return this.estadisticas.ultimasConsultas.slice(0, 3);
  }

  getDiagnosticosRecientes() {
    if (!this.estadisticas) return [];
    return this.estadisticas.diagnosticosRecientes;
  }

  getExamenesPendientes() {
    if (!this.estadisticas) return [];
    return this.estadisticas.examenesPendientes;
  }

  getMedicamentosCronicos() {
    if (!this.estadisticas) return [];
    return this.estadisticas.medicamentosCronicos;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); 
  }

  getConsultasPorcentaje(): number {
    if (this.metricas.totalConsultas === 0) return 0;
    return Math.min((this.metricas.consultasUltimos30Dias / this.metricas.totalConsultas) * 100, 100);
  }

  ngOnDestroy() {
    this.familiaRealtimeSub?.unsubscribe();
  }

  private suscribirseCambiosFamilia() {
    if (this.familiaRealtimeSub) {
      return;
    }
    this.familiaRealtimeSub = this.familiasRealtimeService.familiasChanged$.subscribe(() => {
      this.cargarDatos();
    });
  }
}