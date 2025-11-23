import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ExamenesService, ExamenBasicoCrear } from '../../core/servicios/examenes.service';
import { ConsultasService } from '../../core/servicios/consultas.service';

@Component({
  selector: 'app-crear-examen',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './crear-examen.page.html',
  styleUrls: ['./crear-examen.page.scss']
})
export class CrearExamenPage implements OnInit {
  private examenesService = inject(ExamenesService);
  private consultasService = inject(ConsultasService);

  pacienteId = 1; // Simulación sesión
  cargandoConsultas = false;
  guardando = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'error' | null = null;

  consultas: { idConsulta: number; fechaIngreso: string; motivo?: string }[] = [];

  examen: ExamenBasicoCrear = {
    nombreExamen: '',
    tipoExamen: '',
    unidadMedida: '',
    valorReferencia: '',
    idConsulta: undefined,
    observacion: ''
  };

  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas() {
    this.cargandoConsultas = true;
    this.consultasService.getConsultasPaciente(this.pacienteId).subscribe({
      next: (lista: any[]) => {
        this.consultas = (lista || []).map(c => ({
          idConsulta: c.idConsulta,
            fechaIngreso: c.fechaIngreso,
            motivo: c.motivo
        })).slice(0, 25);
        this.cargandoConsultas = false;
      },
      error: (err) => {
        console.error('Error cargando consultas:', err);
        this.cargandoConsultas = false;
      }
    });
  }

  guardar() {
    if (this.guardando) return;
    this.mensaje = null;
    if (!this.examen.nombreExamen.trim() || !this.examen.tipoExamen.trim()) {
      this.mensaje = 'Nombre y tipo son requeridos';
      this.tipoMensaje = 'error';
      return;
    }
    this.guardando = true;
    this.examenesService.crearExamenBasico(this.pacienteId, this.examen).subscribe({
      next: (resp) => {
        this.mensaje = 'Examen creado correctamente';
        this.tipoMensaje = 'success';
        this.guardando = false;
        // Reset parcial
        this.examen.nombreExamen = '';
        this.examen.tipoExamen = '';
        this.examen.unidadMedida = '';
        this.examen.valorReferencia = '';
        this.examen.observacion = '';
        this.examen.idConsulta = undefined;
      },
      error: (err) => {
        console.error('Error creando examen:', err);
        this.mensaje = 'Error al crear examen';
        this.tipoMensaje = 'error';
        this.guardando = false;
      }
    });
  }
}
