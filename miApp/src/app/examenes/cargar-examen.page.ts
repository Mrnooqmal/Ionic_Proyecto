import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ExamenesService } from '../../core/servicios/examenes.service';
import { ConsultasService } from '../../core/servicios/consultas.service';

@Component({
  selector: 'app-cargar-examen',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './cargar-examen.page.html',
  styleUrls: ['./cargar-examen.page.scss']
})
export class CargarExamenPage implements OnInit {
  private examenesService = inject(ExamenesService);
  private consultasService = inject(ConsultasService);

  pacienteId = 1; // Simulación sesión
  cargandoConsultas = false;
  subiendo = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'error' | null = null;

  // Estados
  etapa: 'seleccion' | 'resumen' | 'completado' = 'seleccion'; // Flujo: seleccion → resumen → completado

  consultas: { idConsulta: number; fechaIngreso: string; motivo?: string }[] = [];
  archivoSeleccionado: File | null = null;
  archivoBase64: string | null = null;
  idConsultaSeleccionada: number | null = null;
  consultaSeleccionadaInfo: any = null;
  examenCreado: { idExamen: number; nombreExamen: string } | null = null;

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
      error: (err: any) => {
        console.error('Error cargando consultas:', err);
        this.cargandoConsultas = false;
      }
    });
  }

  seleccionarArchivo(event: any) {
    const archivos = event.target.files;
    if (archivos && archivos.length > 0) {
      this.archivoSeleccionado = archivos[0];
      this.mensaje = null;

      // Validar tipo
      const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (this.archivoSeleccionado && !tiposPermitidos.includes(this.archivoSeleccionado.type)) {
        this.mensaje = 'Solo se permiten archivos PDF, JPG o PNG';
        this.tipoMensaje = 'error';
        this.archivoSeleccionado = null;
        return;
      }

      // Validar tamaño (máx 10MB)
      if (this.archivoSeleccionado && this.archivoSeleccionado.size > 10 * 1024 * 1024) {
        this.mensaje = 'El archivo no puede superar 10MB';
        this.tipoMensaje = 'error';
        this.archivoSeleccionado = null;
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.archivoBase64 = e.target.result.split(',')[1];
      };
      if (this.archivoSeleccionado) {
        reader.readAsDataURL(this.archivoSeleccionado);
      }
    }
  }

  mostrarResumen() {
    if (!this.idConsultaSeleccionada) {
      this.mensaje = 'Debe seleccionar una consulta';
      this.tipoMensaje = 'error';
      return;
    }
    if (!this.archivoSeleccionado || !this.archivoBase64) {
      this.mensaje = 'Debe seleccionar un archivo';
      this.tipoMensaje = 'error';
      return;
    }

    // Obtener info de consulta seleccionada
    this.consultaSeleccionadaInfo = this.consultas.find(c => c.idConsulta === this.idConsultaSeleccionada);
    this.etapa = 'resumen';
  }

  regresarSeleccion() {
    this.etapa = 'seleccion';
    this.mensaje = null;
  }

  subirArchivo() {
    if (!this.idConsultaSeleccionada) {
      this.mensaje = 'Debe seleccionar una consulta';
      this.tipoMensaje = 'error';
      return;
    }
    if (!this.archivoSeleccionado || !this.archivoBase64) {
      this.mensaje = 'Debe seleccionar un archivo';
      this.tipoMensaje = 'error';
      return;
    }

    this.subiendo = true;
    this.mensaje = null;

    // Si aún no hay examen creado, crear uno primero
    if (!this.examenCreado) {
      const nombreArchivo = this.archivoSeleccionado.name;
      this.examenesService.crearExamenBasico(this.pacienteId, {
        nombreExamen: `Examen - ${nombreArchivo}`,
        tipoExamen: 'Archivo/Imagen',
        idConsulta: this.idConsultaSeleccionada,
        observacion: `Archivo: ${nombreArchivo}`
      }).subscribe({
        next: (examen: any) => {
          this.examenCreado = {
            idExamen: examen.idExamen,
            nombreExamen: examen.nombreExamen
          };
          this.subirBlob();
        },
        error: (err: any) => {
          console.error('Error creando examen:', err);
          this.mensaje = 'Error al crear examen';
          this.tipoMensaje = 'error';
          this.subiendo = false;
        }
      });
    } else {
      this.subirBlob();
    }
  }

  private subirBlob() {
    if (!this.examenCreado || !this.idConsultaSeleccionada) return;

    this.examenesService.subirArchivoExamen(
      this.idConsultaSeleccionada,
      this.examenCreado.idExamen,
      this.archivoSeleccionado!.name,
      this.archivoSeleccionado!.type,
      this.archivoBase64!
    ).subscribe({
      next: () => {
        this.etapa = 'completado';
        this.subiendo = false;
        // Reset después de 3 segundos
        setTimeout(() => {
          this.resetFormulario();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error subiendo archivo:', err);
        this.mensaje = 'Error al subir archivo';
        this.tipoMensaje = 'error';
        this.subiendo = false;
      }
    });
  }

  resetFormulario() {
    this.archivoSeleccionado = null;
    this.archivoBase64 = null;
    this.examenCreado = null;
    this.idConsultaSeleccionada = null;
    this.consultaSeleccionadaInfo = null;
    this.mensaje = null;
    this.tipoMensaje = null;
    this.etapa = 'seleccion';
  }

  formatoTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

