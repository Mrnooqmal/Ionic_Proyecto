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
}
