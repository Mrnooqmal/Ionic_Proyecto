import { CrearPaciente } from "./../crear-paciente/crear-paciente.page";
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon,
  IonCardTitle, IonBackButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

import { BusquedaPacientesComponent } from '../../../compartidos/componentes/busqueda-pacientes/busqueda-pacientes.component';
import { ListaPacientesFamiliaComponent } from '../../../compartidos/componentes/lista-pacientes-familia/lista-pacientes-familia.component';
import { PacientesService, Paciente } from '../../../core/servicios/pacientes.service';


@Component({
  selector: 'app-buscar-fichas',
  templateUrl: './buscarFichas.page.html',
  styleUrls: ['./buscarFichas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButton, IonButtons, IonIcon, IonCardTitle,
    BusquedaPacientesComponent,
    ListaPacientesFamiliaComponent, IonBackButton
  ]
})
export class BuscarFichasPage implements OnInit {
  
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  cargando: boolean = false;
  error: string = '';
  terminoBusqueda: string = '';

  constructor(
    private pacientesService: PacientesService,
    private router: Router
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.cargando = true;
    this.error = '';
    
    this.pacientesService.getPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.pacientesFiltrados = pacientes;
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los pacientes';
        this.cargando = false;
      }
    });
  }

  onBusquedaCambiada(termino: string) {
    this.terminoBusqueda = termino;
    
    if (!termino) {
      this.pacientesFiltrados = this.pacientes;
      return;
    }

    this.pacientesFiltrados = this.pacientes.filter(paciente => 
      paciente.nombrePaciente.toLowerCase().includes(termino) ||
      paciente.correo.toLowerCase().includes(termino) ||
      paciente.telefono.includes(termino) ||
      paciente.prevision.toLowerCase().includes(termino)
    );
  }

  onLimpiarBusqueda() {
    this.terminoBusqueda = '';
    this.pacientesFiltrados = this.pacientes;
  }

  onRecargar() {
    this.cargarPacientes();
  }

  onPacienteSeleccionado(paciente: Paciente) {
    this.router.navigate(['/fichas/verFicha', paciente.idPaciente]);
  }

  onAgregarPaciente() {
    this.router.navigate(['/fichas/crear-paciente']);
  }
}