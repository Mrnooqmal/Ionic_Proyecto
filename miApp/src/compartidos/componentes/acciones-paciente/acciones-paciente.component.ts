// src/app/comunes/componentes/acciones-paciente.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton, IonIcon, IonAlert, IonSpinner, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trash, eye } from 'ionicons/icons';
import { Paciente } from '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-acciones-paciente',
  templateUrl: './acciones-paciente.component.html',
  styleUrls: ['./acciones-paciente.component.scss'],
  standalone: true,
  imports: [IonButtons, CommonModule, IonButton, IonIcon, IonAlert, IonSpinner]
})
export class AccionesPacienteComponent {
  @Input() paciente!: Paciente;

  @Output() editar = new EventEmitter<Paciente>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() ver = new EventEmitter<Paciente>();

  @Input() eliminandoId?: number;

  mostrarAlertaEliminar = false;

  //Botones para la alerta definidos en el componente
  botonesAlerta = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelarEliminar()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.confirmarEliminar()
    }
  ];

  constructor() {
    addIcons({ create, trash, eye });
  }

  onEditar() {
    this.editar.emit(this.paciente);
  }

  onEliminar() {
    this.mostrarAlertaEliminar = true;
  }

  onVer() {
    this.ver.emit(this.paciente);
  }

  confirmarEliminar() {
    this.mostrarAlertaEliminar = false;
    if (this.paciente && this.paciente.idPaciente) {
      this.eliminar.emit(this.paciente.idPaciente);
    }
  }

  cancelarEliminar() {
    this.mostrarAlertaEliminar = false;
  }

  onAlertaCerrada() {
    this.mostrarAlertaEliminar = false;
  }

  getMensajeEliminacion(): string {
    return `¿Estás seguro de que quieres eliminar a ${this.paciente?.nombrePaciente}? Esta acción no se puede deshacer.`;
  }

  isEliminando(): boolean {
    return !!this.eliminandoId && this.eliminandoId === this.paciente?.idPaciente;
  }
}
