import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonSearchbar, IonText, IonButton, IonSpinner, 
  IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-busqueda-pacientes',
  templateUrl: './busqueda-pacientes.component.html',
  styleUrls: ['./busqueda-pacientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonSearchbar, IonText, 
    IonButton, IonSpinner, IonCard, IonCardContent
  ]
})
export class BusquedaPacientesComponent {
  
  @Input() cargando: boolean = false;
  @Input() error: string = '';
  @Input() totalPacientes: number = 0;
  @Input() pacientesFiltrados: number = 0;
  @Input() terminoBusqueda: string = '';
  
  @Output() busquedaCambiada = new EventEmitter<string>();
  @Output() limpiarBusqueda = new EventEmitter<void>();
  @Output() recargar = new EventEmitter<void>();

  onBusquedaChange(event: any) {
    const termino = event.detail.value?.toLowerCase() || '';
    this.busquedaCambiada.emit(termino);
  }

  onLimpiarBusqueda() {
    this.limpiarBusqueda.emit();
  }

  onRecargar() {
    this.recargar.emit();
  }
}