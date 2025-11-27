import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ExamenesService, Examen } from '../../core/servicios/examenes.service';

@Component({
  selector: 'app-examenes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss']
})
export class ExamenesPage implements OnInit {
  examenes: Examen[] = [];
  cargando = false;
  error: string | null = null;
  pacienteId = 1; // Simular paciente
  selectedExamen: Examen | null = null;
  descargando = false;

  constructor(private examenesService: ExamenesService) {}

  ngOnInit() {
    this.cargarExamenes();
  }

  cargarExamenes() {
    this.cargando = true;
    this.error = null;
    this.examenesService.getExamenesPaciente(this.pacienteId).subscribe({
      next: (exams: Examen[]) => {
        this.examenes = exams;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando exámenes:', err);
        this.error = 'No se pudieron cargar los exámenes';
        this.cargando = false;
      }
    });
  }

  recargar(event: any) {
    this.cargarExamenes();
    setTimeout(() => event.target.complete(), 500);
  }

  verDetalle(examen: Examen) {
    if (this.selectedExamen && this.selectedExamen.idExamen === examen.idExamen) {
      this.selectedExamen = null;
      return;
    }
    this.selectedExamen = examen;
  }

  cerrarDetalle() {
    this.selectedExamen = null;
  }

  tieneAdjunto(examen: Examen): boolean {
    return !!examen.archivos && examen.archivos.length > 0 && !!examen.idConsulta;
  }

  descargarAdjunto(examen: Examen) {
    if (!this.tieneAdjunto(examen) || !examen.idConsulta) {
      return;
    }
    this.descargando = true;
    this.examenesService.descargarArchivoExamen(examen.idConsulta, examen.idExamen).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = examen.archivos?.[0] || `examen-${examen.idExamen}.pdf`;
        enlace.click();
        window.URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: (err) => {
        console.error('Error descargando adjunto:', err);
        this.descargando = false;
      }
    });
  }

  getResultadoIcon(estado: string) {
    if (estado === 'pendiente') return 'time';
    if (estado === 'anulado') return 'close-circle';
    return 'checkmark-circle';
  }
}
