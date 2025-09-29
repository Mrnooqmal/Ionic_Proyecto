import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, 
  IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonIcon, IonToast, IonSpinner, IonDatetimeButton,
  IonModal, IonDatetime, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, close, calendar } from 'ionicons/icons';
import { PacientesService, Paciente } from '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-formulario-paciente',
  templateUrl: './formulario-paciente.component.html',
  styleUrls: ['./formulario-paciente.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonCard, IonCardContent, IonItem, 
    IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, 
    IonButton, IonIcon, IonToast, IonSpinner, IonGrid, IonRow, IonCol
  ]
})
export class FormularioPacienteComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() pacienteId?: number;
  @Output() guardado = new EventEmitter<Paciente>();
  @Output() cancelado = new EventEmitter<void>();

  paciente: Partial<Paciente> = {
    sexo: 'masculino',
    nacionalidad: 'Chilena',
    prevision: 'FONASA'
  };
  
  cargando = false;
  guardando = false;
  
  // Estados para mensajes
  mostrarToast = false;
  mensajeToast = '';
  tipoToast: 'success' | 'error' = 'success';

  constructor(private pacientesService: PacientesService) {
    addIcons({ save, close, calendar });
  }

  ngOnInit() {
    if (this.modo === 'editar' && this.pacienteId) {
      this.cargarPaciente();
    }
  }

  cargarPaciente() {
    this.cargando = true;
    this.pacientesService.getPacienteById(this.pacienteId!).subscribe({
      next: (ficha) => {
        this.paciente = { ...ficha.paciente };
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar paciente', 'error');
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (!this.validarFormulario()) return;

    this.guardando = true;

    if (this.modo === 'crear') {
      this.pacientesService.crearPaciente(this.paciente as any).subscribe({
        next: (nuevoPaciente) => {
          this.mostrarMensaje('Paciente creado exitosamente', 'success');
          this.guardado.emit(nuevoPaciente);
          this.guardando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al crear paciente: ' + error.message, 'error');
          this.guardando = false;
        }
      });
    } else {
      this.pacientesService.actualizarPaciente(this.pacienteId!, this.paciente).subscribe({
        next: (pacienteActualizado) => {
          this.mostrarMensaje('Paciente actualizado exitosamente', 'success');
          this.guardado.emit(pacienteActualizado);
          this.guardando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al actualizar paciente: ' + error.message, 'error');
          this.guardando = false;
        }
      });
    }
  }

  cancelar() {
    this.cancelado.emit();
  }

  private validarFormulario(): boolean {
    if (!this.paciente.nombrePaciente?.trim()) {
      this.mostrarMensaje('El nombre es requerido', 'error');
      return false;
    }
    if (!this.paciente.correo?.trim()) {
      this.mostrarMensaje('El correo es requerido', 'error');
      return false;
    }
    if (!this.paciente.fechaNacimiento) {
      this.mostrarMensaje('La fecha de nacimiento es requerida', 'error');
      return false;
    }
    return true;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
  }
}