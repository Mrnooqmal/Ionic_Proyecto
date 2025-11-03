import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonIcon, IonText, IonGrid, IonRow, IonCol, IonBadge,
  IonChip, IonAvatar, IonRefresher, IonRefresherContent, IonSpinner, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendar, medical, people, statsChart, document,
  notifications, time, alertCircle, chevronForward,
  bandage, flask
} from 'ionicons/icons';

// Servicios reales
import { PacientesService, Paciente } from '../../core/servicios/pacientes.service';
import { FamiliaService, Familia } from '../../core/servicios/familias.service';

interface QuickAction {
  titulo: string;
  descripcion: string;
  ruta: string;
  icono: string;
  color: string;
  badge?: number;
}

interface Recordatorio {
  tipo: 'consulta' | 'medicamento' | 'examen' | 'vacuna';
  titulo: string;
  descripcion: string;
  hora?: string;
  fecha: string;
  urgente: boolean;
  pacienteId?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './home-dashboard.page.html',
  styleUrls: ['./home-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonIcon, IonText, IonGrid, IonRow, IonCol, IonBadge,
    IonChip, IonAvatar, IonRefresher, IonRefresherContent, IonLabel
  ]
})
export class HomeDashboardPage implements OnInit {
  // ID del paciente actual (simulando sesión)
  pacienteActualId = 1;
  
  // Datos reales
  usuario: any;
  metricas = {
    totalPacientes: 0,
    consultasHoy: 0,
    examenesPendientes: 0,
    alertas: 0
  };
  
  // Lists
  accionesRapidas: QuickAction[] = [];
  recordatorios: Recordatorio[] = [];
  pacientesRecientes: Paciente[] = [];

  // Estados
  cargando = true;
  error = '';

  constructor(
    private router: Router,
    private pacientesService: PacientesService,
    private familiaService: FamiliaService
  ) {
    addIcons({ 
      calendar, medical, people, statsChart, document,
      notifications, time, alertCircle, chevronForward,
      bandage, flask
    });
  }

  async ngOnInit() {
    await this.cargarDatosDashboard();
  }

  private async cargarDatosDashboard() {
    this.cargando = true;
    this.error = '';

    try {
      // Cargar datos en paralelo
      await Promise.all([
        this.cargarUsuarioActual(),
        this.cargarMetricas(),
        this.cargarRecordatorios(),
        this.cargarPacientesRecientes(),
        this.configurarAccionesRapidas()
      ]);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      this.error = 'Error al cargar los datos';
    } finally {
      this.cargando = false;
    }
  }
  private async cargarUsuarioActual() {
    try {
      const paciente = await this.pacientesService.getPacienteById(this.pacienteActualId).toPromise();
      this.usuario = {
        nombre: paciente?.nombrePaciente || 'Usuario',
        especialidad: 'Paciente Principal'
      };
    } catch (error) {
      console.error('Error cargando usuario:', error);
      this.usuario = {
        nombre: 'Usuario',
        especialidad: 'Paciente'
      };
    }
  }

  private async cargarMetricas() {
    try {
      const familias = await this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).toPromise();
      
      let totalPacientes = 0;
      if (familias && Array.isArray(familias)) {
        familias.forEach(familia => {
          if (familia.miembros && Array.isArray(familia.miembros)) {
            totalPacientes += familia.miembros.length;
          }
        });
      }

      this.metricas = {
        totalPacientes: totalPacientes || 0,
        consultasHoy: await this.obtenerConsultasHoy(),
        examenesPendientes: await this.obtenerExamenesPendientes(),
        alertas: await this.obtenerAlertasPendientes()
      };

    } catch (error) {
      console.error('Error cargando métricas:', error);
      this.metricas = {
        totalPacientes: 0,
        consultasHoy: 0,
        examenesPendientes: 0,
        alertas: 0
      };
    }
  }

  private async cargarRecordatorios() {
    try {
      const familias = await this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).toPromise();
      
      const recordatoriosTemp: Recordatorio[] = [];

      if (familias && familias.length > 0) {
        familias.forEach((familia, index) => {
          recordatoriosTemp.push({
            tipo: 'consulta',
            titulo: `Control familiar - ${familia.nombre}`,
            descripcion: 'Revisión mensual del grupo familiar',
            hora: index === 0 ? '10:30 AM' : '3:00 PM',
            fecha: 'Hoy',
            urgente: index === 0
          });
        });

        if (this.metricas.totalPacientes > 0) {
          recordatoriosTemp.push({
            tipo: 'medicamento',
            titulo: 'Recordatorio de medicación',
            descripcion: `${this.metricas.totalPacientes} pacientes en seguimiento`,
            hora: '2:00 PM',
            fecha: 'Hoy',
            urgente: true
          });
        }
      }

      this.recordatorios = recordatoriosTemp;

    } catch (error) {
      console.error('Error cargando recordatorios:', error);
      this.recordatorios = [];
    }
  }

  private async cargarPacientesRecientes() {
    try {
      const familias = await this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).toPromise();
      
      const pacientes: Paciente[] = [];
      
      if (familias && familias.length > 0) {
        familias.forEach(familia => {
          if (familia.miembros && Array.isArray(familia.miembros)) {
            familia.miembros.forEach(miembro => {
              const paciente = this.esPacienteValido(miembro);
              if (paciente && paciente.idPaciente && paciente.idPaciente !== this.pacienteActualId) {
                pacientes.push(paciente);
              }
            });
          }
        });
        
        this.pacientesRecientes = pacientes
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4);
      }

    } catch (error) {
      console.error('Error cargando pacientes recientes:', error);
      this.pacientesRecientes = [];
    }
  }

  private esPacienteValido(obj: any): Paciente | null {
    if (obj && 
      typeof obj.idPaciente === 'number' && 
      typeof obj.nombrePaciente === 'string' &&
      obj.fechaNacimiento) {
      return obj as Paciente;
    }
    
    if (obj && obj.paciente && 
        typeof obj.paciente.idPaciente === 'number' && 
        typeof obj.paciente.nombrePaciente === 'string' &&
        obj.paciente.fechaNacimiento) {
      return obj.paciente as Paciente;
    }
    
    return null;
  }

  private async configurarAccionesRapidas() {
    const totalPacientes = this.metricas.totalPacientes;

    this.accionesRapidas = [
      {
        titulo: 'Pacientes',
        descripcion: 'Gestionar grupo familiar',
        ruta: '/pacientes',
        icono: 'people',
        color: 'primary',
        badge: totalPacientes
      },
      {
        titulo: 'Consultas',
        descripcion: 'Historial médico',
        ruta: '/consultas',
        icono: 'calendar',
        color: 'success',
        badge: this.metricas.consultasHoy
      },
      {
        titulo: 'Medicamentos',
        descripcion: 'Recetas y control',
        ruta: '/recetas',
        icono: 'medical',
        color: 'warning',
        badge: this.metricas.alertas
      },
      {
        titulo: 'Exámenes',
        descripcion: 'Resultados y análisis',
        ruta: '/examenes',
        icono: 'flask',
        color: 'tertiary'
      },
      {
        titulo: 'Estadísticas',
        descripcion: 'Métricas de salud',
        ruta: '/estadisticas',
        icono: 'stats-chart',
        color: 'danger'
      },
      {
        titulo: 'Mi Ficha',
        descripcion: 'Mi información médica',
        ruta: `/pacientes/ficha/${this.pacienteActualId}`,
        icono: 'document',
        color: 'medium'
      }
    ];
  }

  // Métodos temporales para métricas
  private async obtenerConsultasHoy(): Promise<number> {
    return 2;
  }

  private async obtenerExamenesPendientes(): Promise<number> {
    return 1;
  }

  private async obtenerAlertasPendientes(): Promise<number> {
    return this.recordatorios.filter(r => r.urgente).length;
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  handleRefresh(event: any) {
    this.cargarDatosDashboard().finally(() => {
      event.target.complete();
    });
  }

  getIconoTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'consulta': 'calendar',
      'medicamento': 'medical',
      'examen': 'flask',
      'vacuna': 'bandage'
    };
    return iconos[tipo] || 'alert-circle';
  }

  getColorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      'consulta': 'primary',
      'medicamento': 'warning',
      'examen': 'tertiary',
      'vacuna': 'success'
    };
    return colores[tipo] || 'medium';
  }
}