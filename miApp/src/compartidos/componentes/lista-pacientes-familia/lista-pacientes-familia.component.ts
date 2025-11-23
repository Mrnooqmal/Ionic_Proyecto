import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonList, IonItem, IonLabel, IonAvatar, IonButton, 
  IonIcon, IonBadge, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, medical, arrowForward, add } from 'ionicons/icons';
import { Paciente } from  '../../../core/servicios/pacientes.service';


@Component({
  selector: 'app-lista-pacientes-familia',
  templateUrl: './lista-pacientes-familia.component.html',
  styleUrls: ['./lista-pacientes-familia.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonList, IonItem, IonLabel, IonAvatar, 
    IonButton, IonIcon, IonBadge, IonCard, IonCardContent
  ]
})
export class ListaPacientesFamiliaComponent {
  @Input() mostrarEstadisticas: boolean = false;
  @Input() estadisticas: any = {};
  @Output() agregarFamilia = new EventEmitter<void>();
  @Output() verFamilias = new EventEmitter<void>();
  
  @Input() pacientes: Paciente[] = [];
  @Input() mostrarBotonAgregar: boolean = true;
  @Input() titulo: string = 'Mi Grupo Familiar';
  
  @Output() pacienteSeleccionado = new EventEmitter<Paciente>();
  @Output() agregarPaciente = new EventEmitter<void>();

  constructor() {
    addIcons({ person, medical, arrowForward, add });
  }

  seleccionarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado.emit(paciente);
  }

  onAgregarPaciente() {
    this.agregarPaciente.emit();
  }

  calcularEdad(fechaNacimiento?: string | null): number | null {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  getPrevisionColor(prevision?: string | null): string {
    if (!prevision || typeof prevision !== 'string') return 'medium';
    const colores: { [key: string]: string } = {
      'fonasa': 'primary',
      'isapre': 'secondary',
      'particular': 'tertiary',
      'otro': 'medium'
    };
    const key = prevision.trim().toLowerCase();
    return colores[key] || 'medium';
  }

  getAvatar(paciente: any): string {
    const defaultAvatar = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'; 
    return paciente.fotoPerfil ? paciente.fotoPerfil : defaultAvatar;
  }



}