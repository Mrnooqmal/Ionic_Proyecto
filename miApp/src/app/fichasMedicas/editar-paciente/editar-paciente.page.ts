import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonBackButton
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { FormularioPacienteComponent } from '../../../compartidos/componentes/formulario-paciente/formulario-paciente.component';
import { Paciente } from  '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.page.html',
  styleUrls: ['./editar-paciente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    FormularioPacienteComponent
  ]
})
export class EditarPaciente implements OnInit {
  pacienteId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.pacienteId = +this.route.snapshot.params['id'];
  }

  onPacienteGuardado(paciente: Paciente) {
    // Redirigir a la ficha del paciente después de 1.5 segundos
    setTimeout(() => {
      this.router.navigate(['/fichas/verFicha', paciente.idPaciente]);
    }, 1500);
  }

  onFormularioCancelado() {
    this.router.navigate(['/fichas/verFicha', this.pacienteId]);
  }
}