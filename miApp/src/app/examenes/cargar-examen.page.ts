import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonSelect, IonSelectOption, IonItem, IonInput,
  IonSpinner, IonList, IonIcon, 
  IonBackButton, IonButtons
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  document, cloudUpload, analytics, checkmarkCircle, 
  closeCircle, alertCircle, informationCircle, 
  people, calendar, flash, download
} from 'ionicons/icons';

import { ExamenesService } from '../../core/servicios/examenes.service';
import { ConsultasService } from '../../core/servicios/consultas.service';
import { TextractService, TextractAnalisisResultado, TextractSugerencia } from '../../core/servicios/textract.service';

@Component({
  selector: 'app-cargar-examen',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonSelect, IonSelectOption, IonItem, IonInput,
    IonSpinner, IonList, IonIcon,
    IonBackButton, IonButtons
  ],
  templateUrl: './cargar-examen.page.html',
  styleUrls: ['./cargar-examen.page.scss']
})
export class CargarExamenPage implements OnInit {
  private examenesService = inject(ExamenesService);
  private consultasService = inject(ConsultasService);
  private textractService = inject(TextractService);

  pacienteId = 1; // Simulación sesión
  cargandoConsultas = false;
  subiendo = false;
  analizandoTextract = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'error' | null = null;

  // Estados
  etapa: 'seleccion' | 'resumen' | 'textract-analisis' | 'textract-sugerencias' | 'completado' = 'seleccion';

  consultas: { idConsulta: number; fechaIngreso: string; motivo?: string }[] = [];
  archivoSeleccionado: File | null = null;
  archivoBase64: string | null = null;
  idConsultaSeleccionada: number | null = null;
  consultaSeleccionadaInfo: any = null;
  examenCreado: { idExamen: number; nombreExamen: string } | null = null;

  // Textract
  usarTextract = true; // Flag para activar/desactivar Textract
  analisisTextract: TextractAnalisisResultado | null = null;
  sugerenciasTextract: TextractSugerencia[] = [];
  confianzaTextract = 0;

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
        // Si Textract está activado, proceder a análisis
        if (this.usarTextract) {
          this.iniciarAnalisisTextract();
        } else {
          this.etapa = 'completado';
          this.subiendo = false;
          setTimeout(() => this.resetFormulario(), 3000);
        }
      },
      error: (err: any) => {
        console.error('Error subiendo archivo:', err);
        this.mensaje = 'Error al subir archivo';
        this.tipoMensaje = 'error';
        this.subiendo = false;
      }
    });
  }

  /**
   * Inicia el análisis con AWS Textract
   */
  private iniciarAnalisisTextract() {
    if (!this.examenCreado || !this.idConsultaSeleccionada) return;

    this.analizandoTextract = true;
    this.etapa = 'textract-analisis';
    this.mensaje = 'Analizando documento con AWS Textract...';

    this.textractService.analizarDocumentoConTextract(
      this.idConsultaSeleccionada,
      this.examenCreado.idExamen,
      this.archivoSeleccionado!.name,
      this.archivoSeleccionado!.type,
      this.archivoBase64!
    ).subscribe({
      next: (analisis: TextractAnalisisResultado) => {
        this.analisisTextract = analisis;
        this.confianzaTextract = analisis.confianza;
        console.log('Análisis completado:', analisis);

        // Si la confianza es alta, mostrar sugerencias
        if (this.textractService.validarConfianza(analisis)) {
          this.obtenerSugerenciasTextract();
        } else {
          // Confianza baja, ir directamente a completado
          console.warn('Confianza baja en análisis Textract:', analisis.confianza);
          this.etapa = 'completado';
          this.analizandoTextract = false;
          this.mensaje = null;
          setTimeout(() => this.resetFormulario(), 3000);
        }
      },
      error: (err: any) => {
        console.error('Error en análisis Textract:', err);
        // Si Textract falla, continuar sin análisis
        console.warn('Textract no disponible, guardando sin análisis');
        this.etapa = 'completado';
        this.analizandoTextract = false;
        this.mensaje = null;
        setTimeout(() => this.resetFormulario(), 3000);
      }
    });
  }

  /**
   * Obtiene sugerencias de Textract después del análisis
   */
  private obtenerSugerenciasTextract() {
    if (!this.examenCreado || !this.idConsultaSeleccionada || !this.archivoBase64) return;

    this.textractService.obtenerSugerenciasTextract(
      this.idConsultaSeleccionada,
      this.examenCreado.idExamen,
      this.archivoBase64,
      this.archivoSeleccionado?.type || 'application/pdf'
    ).subscribe({
      next: (sugerencias: TextractSugerencia[]) => {
        this.sugerenciasTextract = sugerencias;
        this.analizandoTextract = false;

        if (sugerencias && sugerencias.length > 0) {
          this.etapa = 'textract-sugerencias';
          this.mensaje = null;
        } else {
          // Sin sugerencias, ir a completado
          this.etapa = 'completado';
          setTimeout(() => this.resetFormulario(), 3000);
        }
      },
      error: (err: any) => {
        console.error('Error obteniendo sugerencias:', err);
        this.etapa = 'completado';
        this.analizandoTextract = false;
        setTimeout(() => this.resetFormulario(), 3000);
      }
    });
  }

  /**
   * Acepta sugerencias de Textract
   */
  aceptarSugerenciasTextract() {
    if (!this.examenCreado || !this.idConsultaSeleccionada) return;

    // Mapear sugerencias a estructura de examen
    const valoresExtraidos = this.textractService.extraerValoresFormulario(this.sugerenciasTextract);
    console.log('Sugerencias aceptadas:', valoresExtraidos);

    // Aplicar sugerencias
    this.textractService.aplicarSugerenciasTextract(
      this.idConsultaSeleccionada,
      this.examenCreado.idExamen,
      valoresExtraidos
    ).subscribe({
      next: () => {
        this.etapa = 'completado';
        setTimeout(() => this.resetFormulario(), 3000);
      },
      error: () => {
        // Aunque falle validación, ir a completado
        this.etapa = 'completado';
        setTimeout(() => this.resetFormulario(), 3000);
      }
    });
  }

  /**
   * Rechaza sugerencias de Textract y usa valores manuales
   */
  rechazarSugerenciasTextract() {
    console.log('Sugerencias rechazadas, usando datos sin Textract');
    this.etapa = 'completado';
    setTimeout(() => this.resetFormulario(), 3000);
  }

  /**
   * Editar sugerencias antes de confirmar
   */
  editarSugerencia(indice: number, nuevoValor: string) {
    if (this.sugerenciasTextract[indice]) {
      this.sugerenciasTextract[indice].valorSugerido = nuevoValor;
    }
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

