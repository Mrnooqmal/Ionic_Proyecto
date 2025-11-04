import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonSkeletonText, IonChip, IonLabel,
  IonGrid, IonRow, IonCol, IonBadge, IonRefresher, IonRefresherContent, IonAvatar, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  home, person, heart, pulse, thermometer, scale,
  calendar, medical, flask, document, alertCircle,
  trendingUp, trendingDown, checkmarkCircle,
  people, receipt, add, settings, water,
  notifications, chevronForward, time, personAdd
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home-dashboard.page.html',
  styleUrls: ['./home-dashboard.page.scss'],
  standalone: true,
  imports: [IonText, IonAvatar, IonRefresherContent, IonRefresher, 
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonSkeletonText, IonChip, IonLabel,
    IonGrid, IonRow, IonCol, IonBadge
  ]
})
export class HomeDashboardPage implements OnInit {
  cargando = true;
  
  // Datos del usuario (doctor)
  usuario = {
    nombre: 'Dr. García',
    especialidad: 'Cardiología'
  };

  // Métricas del dashboard
  metricas = {
    totalPacientes: 145,
    consultasHoy: 8,
    examenesPendientes: 3,
    alertas: 2
  };

  // Acciones rápidas - CORREGIDAS LAS RUTAS
  accionesRapidas = [
    {
      titulo: 'Nuevo Paciente',
      descripcion: 'Registrar paciente',
      icono: 'person-add',
      ruta: '/fichas/crear-paciente', // Ruta existente
      color: 'primary',
      badge: null
    },
    {
      titulo: 'Consultas',
      descripcion: 'Agendar cita',
      icono: 'calendar',
      ruta: '/home', // Usando home como temporal
      color: 'success',
      badge: null
    },
    {
      titulo: 'Exámenes',
      descripcion: 'Resultados pendientes',
      icono: 'document',
      ruta: '/home', // Usando home como temporal
      color: 'warning',
      badge: 3
    },
    {
      titulo: 'Recetas',
      descripcion: 'Prescripciones',
      icono: 'medical',
      ruta: '/home', // Usando home como temporal
      color: 'tertiary',
      badge: null
    }
  ];

  // Recordatorios
  recordatorios = [
    {
      titulo: 'Consulta con Ana López',
      descripcion: 'Control mensual - Hipertensión',
      tipo: 'consulta',
      hora: '09:30 AM',
      fecha: 'Hoy',
      urgente: false
    },
    {
      titulo: 'Revisar resultados',
      descripcion: 'Laboratorio - Carlos Rodríguez',
      tipo: 'examen',
      hora: '11:00 AM',
      fecha: 'Hoy',
      urgente: true
    },
    {
      titulo: 'Sesión de equipo',
      descripcion: 'Reunión médica semanal',
      tipo: 'reunion',
      hora: '03:00 PM',
      fecha: 'Hoy',
      urgente: false
    }
  ];

  constructor(private router: Router) {
    addIcons({ 
      home, person, heart, pulse, thermometer, scale,
      calendar, medical, flask, document, alertCircle,
      trendingUp, trendingDown, checkmarkCircle,
      people, receipt, add, settings, water,
      notifications, chevronForward, time, personAdd
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.cargando = false;
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.cargarDatos();
      event.target.complete();
    }, 1000);
  }

  navegar(ruta: string) {
    console.log('Navegando a:', ruta);
    this.router.navigateByUrl(ruta);
  }

  getIconoTipo(tipo: string): string {
    const icons: any = {
      'consulta': 'calendar',
      'examen': 'flask',
      'reunion': 'people',
      'recordatorio': 'alert-circle'
    };
    return icons[tipo] || 'medical';
  }

  getColorTipo(tipo: string): string {
    const colors: any = {
      'consulta': 'primary',
      'examen': 'warning',
      'reunion': 'success',
      'recordatorio': 'danger'
    };
    return colors[tipo] || 'medium';
  }
}