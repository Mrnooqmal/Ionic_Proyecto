import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { FormularioPacienteComponent } from '../../../compartidos/componentes/formulario-paciente/formulario-paciente.component';
import { Paciente } from  '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.page.html',
  styleUrls: ['./crear-paciente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    FormularioPacienteComponent
  ]
})
export class CrearPaciente {
  constructor(private router: Router) {
    addIcons({ arrowBack });
  }

  onPacienteGuardado(paciente: Paciente) {
    // Redirigir a la lista después de 1.5 segundos para mostrar el mensaje
    setTimeout(() => {
      this.router.navigate(['/fichas/buscarFichas']);
    }, 1500);
  }

  onFormularioCancelado() {
    this.router.navigate(['/fichas/buscarFichas']);
  }
}