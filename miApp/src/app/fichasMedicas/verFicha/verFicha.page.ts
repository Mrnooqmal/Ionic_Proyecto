import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonGrid, IonRow, IonCol, IonBadge, IonSpinner, IonAvatar, IonBackButton,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBack, person, medical, document, create, print, 
  clipboard, analytics, construct, warning, fitness, cafe,
  location, call, calendar, school, globe, trashOutline, peopleOutline
} from 'ionicons/icons';
import { PacientesService, FichaMedicaCompleta, Paciente } from '../../../core/servicios/pacientes.service';
import { FamiliaService } from '../../../core/servicios/familias.service';

@Component({
  selector: 'app-verFicha',
  templateUrl: './verFicha.page.html',
  styleUrls: ['./verFicha.page.scss'],
  standalone: true,
  imports: [
    RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, IonButton, IonButtons, IonIcon, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonGrid, IonRow, IonCol, IonBadge, IonSpinner, IonAvatar,
    IonBackButton
  ]
})
export class VerFichaPage implements OnInit {
  @ViewChild(IonContent) ionContent!: IonContent;
  
  fichaId: string = '';
  ficha!: FichaMedicaCompleta;
  cargando: boolean = true;
  error: string = '';
  pacienteActualId = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacientesService: PacientesService,
    private familiaService: FamiliaService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ 
      arrowBack, person, medical, document, create, print, 
      clipboard, analytics, construct, warning, fitness, cafe,
      location, call, calendar, school, globe, trashOutline, peopleOutline
    });
  }

  ngOnInit() {
    this.fichaId = this.route.snapshot.paramMap.get('id') || '1';
    console.log('Viendo ficha ID:', this.fichaId);
    this.cargarFicha();
  }

  ionViewDidEnter() {
    // Scroll al top cuando la vista se carga
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToTop(0);
      }
    }, 100);
  }
  cargarFicha() {
    this.cargando = true;
    this.error = '';
    
    this.pacientesService.getFichaMedicaCompleta(parseInt(this.fichaId)).subscribe({
      next: (ficha: FichaMedicaCompleta) => {
        this.ficha = ficha;
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

  getAlergiasTexto(): string {
    if (!this.ficha?.alergias || this.ficha.alergias.length === 0) {
      return 'No registra alergias';
    }
    return this.ficha.alergias.map(alergia => 
      `• ${alergia.alergia}${alergia.observacion ? ` - ${alergia.observacion}` : ''}`
    ).join('\n');
  }

  getHabitosTexto(): string {
    if (!this.ficha?.habitos || this.ficha.habitos.length === 0) {
      return 'No registra hábitos';
    }
    return this.ficha.habitos.map(habito => 
      `• ${habito.habito}${habito.observacion ? `: ${habito.observacion}` : ''}`
    ).join('\n');
  }

  getMedicamentosTexto(): string {
    if (!this.ficha?.medicamentos || this.ficha.medicamentos.length === 0) {
      return 'No registra medicamentos';
    }
    return this.ficha.medicamentos.map(med => 
      `• ${med.nombreMedicamento}${med.frecuencia ? ` (${med.frecuencia})` : ''}`
    ).join('\n');
  }

  getConsultasTexto(): string {
    if (!this.ficha?.consultas || this.ficha.consultas.length === 0) {
      return 'No registra consultas';
    }
    return this.ficha.consultas.map(consulta => 
      `• ${consulta.motivo}\n  Fecha: ${consulta.fechaIngreso}\n  Profesional: ${consulta.profesional}`
    ).join('\n\n');
  }

  getExamenesTexto(): string {
    if (!this.ficha?.examenes || this.ficha.examenes.length === 0) {
      return 'No registra exámenes';
    }
    return this.ficha.examenes.map(examen => 
      `• ${examen.nombreExamen}\n  Fecha: ${examen.fecha}\n  Resultado: ${examen.resultado}`
    ).join('\n\n');
  }

  getDiagnosticosTexto(): string {
    if (!this.ficha?.diagnosticos || this.ficha.diagnosticos.length === 0) {
      return 'No registra diagnósticos';
    }
    return this.ficha.diagnosticos.map(diagnostico => 
      `• ${diagnostico.diagnostico}\n  Fecha: ${diagnostico.fecha}${diagnostico.estado ? `\n  Estado: ${diagnostico.estado}` : ''}`
    ).join('\n\n');
  }

  getProcedimientosTexto(): string {
    if (!this.ficha?.procedimientos || this.ficha.procedimientos.length === 0) {
      return 'No registra procedimientos';
    }
    return this.ficha.procedimientos.map(proc => 
      `• ${proc.nombreProcedimiento}\n  Fecha: ${proc.fecha}${proc.resultado ? `\n  Resultado: ${proc.resultado}` : ''}`
    ).join('\n\n');
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  editarFicha() {
    this.router.navigate(['/fichas/editar-paciente', this.fichaId]);
  }

  imprimirFicha() {
    window.print();
  }

  getAvatar(): string {
    return this.ficha?.paciente?.fotoPerfil || 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';
  }

  volverAtras() {
    this.router.navigate(['/home']);
  }

  getPrevisionColor(prevision: string): string {
    switch (prevision.toLowerCase()) {
      case 'fonasa':
        return 'primary';
      case 'isapre':
        return 'secondary';
      default:
        return 'medium';
    }
  }

  async eliminarDelGrupoFamiliar() {
    const alert = await this.alertController.create({
      header: 'Eliminar del grupo familiar',
      message: `¿Estás seguro de que deseas eliminar a ${this.ficha.paciente.nombrePaciente} del grupo familiar? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.confirmarEliminacion();
          }
        }
      ]
    });

    await alert.present();
  }

  private async confirmarEliminacion() {
    try {
      // Obtener las familias del paciente actual
      this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
        next: async (familias: any) => {
          const familiasArray = familias.data || [];
          
          if (familiasArray.length === 0) {
            await this.mostrarToast('No se encontró ninguna familia', 'warning');
            return;
          }

          // Buscar la familia que contiene al paciente a eliminar
          let familiaEncontrada = null;
          for (const familia of familiasArray) {
            const miembro = familia.miembros?.find((m: any) => m.idPaciente === parseInt(this.fichaId));
            if (miembro) {
              familiaEncontrada = familia;
              break;
            }
          }

          if (!familiaEncontrada) {
            await this.mostrarToast('El paciente no está en tu grupo familiar', 'warning');
            return;
          }

          // Eliminar el miembro de la familia
          this.familiaService.eliminarMiembro(familiaEncontrada.idFamilia, parseInt(this.fichaId)).subscribe({
            next: async () => {
              await this.mostrarToast('Paciente eliminado del grupo familiar exitosamente', 'success');
              // Volver a la página de gestión de pacientes
              this.router.navigate(['/gestion-pacientes']);
            },
            error: async (err) => {
              console.error('Error eliminando miembro:', err);
              await this.mostrarToast('Error al eliminar del grupo familiar', 'danger');
            }
          });
        },
        error: async (err) => {
          console.error('Error obteniendo familias:', err);
          await this.mostrarToast('Error al verificar la familia', 'danger');
        }
      });
    } catch (error) {
      console.error('Error en confirmación:', error);
      await this.mostrarToast('Error inesperado', 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}