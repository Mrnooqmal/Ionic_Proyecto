import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonGrid, IonRow, IonCol, IonBadge, IonSpinner, IonAvatar
} from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBack, person, medical, document, create, print, 
  clipboard, analytics, construct, warning, cut, fitness, cafe 
} from 'ionicons/icons';
import { PacientesService, FichaMedicaCompleta, Paciente } from '../../../core/servicios/pacientes.service';

@Component({
  selector: 'app-verFicha',
  templateUrl: './verFicha.page.html',
  styleUrls: ['./verFicha.page.scss'],
  standalone: true,
  imports: [
    RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, IonButton, IonButtons, IonIcon, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonGrid, IonRow, IonCol, IonBadge, IonSpinner,IonAvatar
  ]
})
export class VerFichaPage implements OnInit {
  paciente?: Paciente;
  fichaId: string = '';
  ficha!: FichaMedicaCompleta;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService
  ) {
    addIcons({ 
      arrowBack, person, medical, document, create, print, 
      clipboard, analytics, construct, warning, cut, fitness, cafe 
    });
  }

  ngOnInit() {
    this.fichaId = this.route.snapshot.paramMap.get('id') || '1';
    console.log('Viendo ficha ID:', this.fichaId);
    this.cargarFicha();
  }

  cargarFicha() {
    this.cargando = true;
    this.error = '';
    
    this.pacientesService.getPacienteById(parseInt(this.fichaId)).subscribe({
      next: (ficha: FichaMedicaCompleta) => {
        this.ficha = ficha;
        this.paciente = ficha.paciente;
        this.cargando = false;
        console.log('Ficha cargada:', ficha);
      },
      error: (error: any) => {
        this.error = 'Error al cargar la ficha médica';
        this.cargando = false;
        console.error('Error:', error);
      }
    });
  }

  // Métodos auxiliares para formatear datos
  getAlergiasTexto(): string {
    if (!this.ficha?.alergias || this.ficha.alergias.length === 0) {
      return 'No registra alergias';
    }
    return this.ficha.alergias.map((a: any) => 
      `${a.alergia}${a.observacion ? ` (${a.observacion})` : ''}`
    ).join('\n');
  }

  getHabitosTexto(): string {
    if (!this.ficha?.habitos || this.ficha.habitos.length === 0) {
      return 'No registra hábitos';
    }
    return this.ficha.habitos.map((h: any) => 
      `${h.habito}${h.observacion ? `: ${h.observacion}` : ''}`
    ).join('\n');
  }

  getMedicamentosTexto(): string {
    if (!this.ficha?.medicamentos || this.ficha.medicamentos.length === 0) {
      return 'No registra medicamentos';
    }
    return this.ficha.medicamentos.map((m: any) => 
      m.nombreMedicamento
    ).join('\n');
  }

  getConsultasTexto(): string {
    if (!this.ficha?.consultas || this.ficha.consultas.length === 0) {
      return 'No registra consultas';
    }
    return this.ficha.consultas.map((c: any) => 
      `${c.motivo} - ${c.fechaIngreso}`
    ).join('\n');
  }

  editarFicha() {
    console.log('Editando ficha ID:', this.fichaId);
    this.router.navigate(['/fichas/editarFicha', this.fichaId]);
  }

  imprimirFicha() {
    console.log('Imprimiendo ficha ID:', this.fichaId);
    window.print();
  }

  volverAtras() {
    this.router.navigate(['/fichas/buscarFichas']);
  }

  getAvatar(paciente: any): string {
    const defaultAvatar = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';
    return paciente && paciente.fotoPerfil ? paciente.fotoPerfil : defaultAvatar;
  }


}