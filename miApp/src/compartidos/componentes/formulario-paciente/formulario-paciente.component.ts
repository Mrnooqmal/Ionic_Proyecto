import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardContent, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonIcon, IonToast, IonSpinner, IonGrid, IonRow, IonCol
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
  @Input() cargando: boolean = false; // 
  @Output() guardado = new EventEmitter<Paciente>();
  @Output() cancelado = new EventEmitter<void>();

  paciente: Partial<Paciente> = {
    sexo: 'masculino',
    nacionalidad: 'Chilena',
    prevision: 'FONASA',
    rolFamiliar: 'familiar' 
  };

  rolesFamilia = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'familiar', label: 'Familiar' },
    { value: 'tutor', label: 'Tutor' },
    { value: 'hijo', label: 'Hijo/Hija' },
    { value: 'pareja', label: 'Pareja' },
    { value: 'padre', label: 'Padre/Madre' }
  ];
  
  guardando = false;
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
      next: (paciente) => {
        this.paciente = { ...paciente };
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar paciente', 'error');
        console.error('Error cargarPaciente:', error);
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.guardando) {
      console.log('⏳ Ya se está guardando, ignorando envío duplicado');
      return;
    }

    if (!this.validarFormulario()) return;

    console.log('Datos a enviar:', this.paciente);

    const payload = this.prepararPayload();

    console.log('Payload final:', payload);

    this.guardando = true;

    if (this.modo === 'crear') {
      this.crearPaciente(payload);
    } else {
      this.actualizarPaciente(payload);
    }
  }

  private prepararPayload(): any {
    const basePayload: any = {
      ...this.paciente,
      sexo: this.paciente.sexo?.toLowerCase(),
      fechaNacimiento: this.formatearFecha(this.paciente.fechaNacimiento!),
    };

    if (this.modo === 'editar') {
      if (this.paciente.correo?.trim()) {
        basePayload.correo = this.paciente.correo.trim();
      } else {
        basePayload.correo = null;
      }
    } else {
      basePayload.correo = this.paciente.correo?.trim() || null;
    }

    return basePayload;
  }

  private crearPaciente(payload: any) {
    this.pacientesService.crearPaciente(payload).subscribe({
      next: (nuevoPaciente) => {
        console.log('Paciente creado:', nuevoPaciente);
        this.mostrarMensaje('Paciente creado exitosamente', 'success');
        this.guardado.emit(nuevoPaciente);
        this.guardando = false;
      },
      error: (error) => {
        console.log('Error completo:', error);
        console.log('Error body:', error.error);
        const msg = this.procesarErrores(error);
        this.mostrarMensaje('Error al crear paciente: ' + msg, 'error');
        this.guardando = false;
      }
    });
  }

  private actualizarPaciente(payload: any) {
    this.pacientesService.actualizarPaciente(this.pacienteId!, payload).subscribe({
      next: (pacienteActualizado) => {
        console.log('Paciente actualizado:', pacienteActualizado);
        this.mostrarMensaje('Paciente actualizado exitosamente', 'success');
        this.guardado.emit(pacienteActualizado);
        this.guardando = false;
      },
      error: (error) => {
        console.log('Error completo al actualizar:', error);
        console.log('Error body:', error.error);
        const msg = this.procesarErrores(error);
        this.mostrarMensaje('Error al actualizar paciente: ' + msg, 'error');
        console.error('Error detalle:', error);
        this.guardando = false;
      }
    });
  }

  private procesarErrores(error: any): string {
    if (error?.error?.errors) {
      const errores = error.error.errors;
      console.log('Errores de validación:', errores);
      
      return Object.entries(errores)
        .map(([campo, mensajes]) => {
          const mensaje = Array.isArray(mensajes) ? mensajes.join(', ') : String(mensajes);
          return `${this.mapearNombreCampo(campo)}: ${mensaje}`;
        })
        .join(' | ');
    }
    return error?.message || 'Error desconocido';
  }

  private mapearNombreCampo(campo: string): string {
    const mapeo: { [key: string]: string } = {
      'correo': 'Correo electrónico',
      'nombrePaciente': 'Nombre',
      'fechaNacimiento': 'Fecha de nacimiento',
      'telefono': 'Teléfono',
      'sexo': 'Sexo',
      'prevision': 'Previsión',
      'tipoSangre': 'Tipo de sangre',
      'nacionalidad': 'Nacionalidad',
      'ocupacion': 'Ocupación',
      'direccion': 'Dirección'
    };
    return mapeo[campo] || campo;
  }

  private formatearFecha(fecha: string | Date): string {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cancelar() {
    this.cancelado.emit();
  }

  private validarFormulario(): boolean {
    if (!this.paciente.nombrePaciente?.trim()) {
      this.mostrarMensaje('El nombre es requerido', 'error');
      return false;
    }

    if (!this.paciente.fechaNacimiento) {
      this.mostrarMensaje('La fecha de nacimiento es requerida', 'error');
      return false;
    }

    if (this.paciente.correo?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.paciente.correo.trim())) {
        this.mostrarMensaje('El correo no es válido', 'error');
        return false;
      }
    }

    return true;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
  }
}