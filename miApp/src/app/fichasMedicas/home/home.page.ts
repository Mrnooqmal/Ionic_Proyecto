import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonSkeletonText, IonChip, IonLabel
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  home, addCircle, search, document, people, medical, 
  settings, add, flask, receipt, statsChart, personCircle,
  calendarOutline, heartOutline
} from 'ionicons/icons';
import { PacientesService, Paciente } from '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-fichas',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonButtons, 
    IonIcon, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle,
    IonSkeletonText,
    IonChip,
    IonLabel
  ]
})
export class HomePage implements OnInit {
  pacienteActual: Paciente | null = null;
  cargando = true;
  edad: number = 0;
  mensajeError: string | null = null;
  esModoDemo = false;

  constructor(
    private pacientesService: PacientesService
  ) {
    addIcons({ 
      home, 
      addCircle, 
      search, 
      document, 
      people, 
      medical, 
      settings,
      add,
      flask,
      receipt,
      statsChart,
      personCircle,
      calendarOutline,
      heartOutline
    });
  }

  ngOnInit() {
    this.cargarPacienteActual();
  }

  cargarPacienteActual() {
    // Simula sesión del paciente ID 1
    this.pacientesService.getPacienteById(1).subscribe({
      next: (paciente) => {
        this.pacienteActual = paciente;
        this.calcularEdad();
        this.cargando = false;
        this.mensajeError = null;
        // Detecta si estamos usando datos mock
        if (!paciente.correo?.includes('@')) {
          this.esModoDemo = true;
        }
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
        this.cargando = false;
        this.mensajeError = 'No se puede conectar con el servidor. Por favor, verifica la conexion a internet o reinicia la aplicacion.';
      }
    });
  }

  calcularEdad() {
    if (!this.pacienteActual?.fechaNacimiento) return;
    
    const hoy = new Date();
    const nacimiento = new Date(this.pacienteActual.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    this.edad = edad;
  }

  get saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }
}