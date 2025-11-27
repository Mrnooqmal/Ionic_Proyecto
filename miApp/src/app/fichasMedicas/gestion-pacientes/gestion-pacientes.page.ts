import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,    
  IonRefresher, IonRefresherContent, 
  IonButtons, IonBackButton, IonSpinner, IonCard, IonCardContent,
  IonIcon, IonAvatar, IonAccordionGroup, IonAccordion, IonItem, IonLabel,
  IonBadge, AlertController, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBack, refresh, person, add, personAdd, people, medical,
  search, alertCircle, checkmarkCircle, time, informationCircle, chevronForward,
  personCircle, personAddOutline, pencil, trashOutline, peopleOutline, searchOutline, home, document, settings } from 'ionicons/icons';

import { BusquedaPacientesComponent } from '../../../compartidos/componentes/busqueda-pacientes/busqueda-pacientes.component';
import { PacientesService, Paciente } from '../../../core/servicios/pacientes.service';
import { FamiliaService, Familia } from '../../../core/servicios/familias.service';
import { FamiliasRealtimeService } from '../../../core/servicios/familias-realtime.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-pacientes',
  templateUrl: './gestion-pacientes.page.html',
  styleUrls: ['./gestion-pacientes.page.scss'],
  standalone: true,
  imports: [ 
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonButtons, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent,
    IonIcon, IonAvatar, IonBackButton, IonSpinner,
    IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonBadge,
    BusquedaPacientesComponent
  ]
})
export class GestionPacientesPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) ionContent!: IonContent;
  
  familias: Familia[] = [];
  pacientesFamilia: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  cargando = true;
  error = '';
  terminoBusqueda = '';

  pacienteActualId = 1; 
  pacienteActualNombre = 'Paciente Principal';

  // ESTADÍSTICAS MEJORADAS
  estadisticas = {
    totalPacientes: 0,
    conAlertas: 0,
    sinFichaCompleta: 0,
    totalFamilias: 0
  };

  private inicializado = false;
  private familiasSyncSub?: Subscription;
  private realtimeSub?: Subscription;

  constructor(
    private familiaService: FamiliaService,
    private familiaRealtimeService: FamiliasRealtimeService,
    private pacientesService: PacientesService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({refresh,people,person,alertCircle,time,checkmarkCircle,informationCircle,pencil,trashOutline,personCircle,peopleOutline,personAddOutline,personAdd,searchOutline,home,document,add,settings,arrowBack,medical,search,chevronForward});
  }

  ngOnInit() {
    console.log('GestionPacientesPage - ngOnInit - Carga inicial');
    this.cargarDatosIniciales();
    this.suscribirseACambiosTiempoReal();
  }

  ionViewWillEnter() {
    console.log('GestionPacientesPage - ionViewWillEnter');
    this.cargarDatosIniciales();
  }

  ionViewDidEnter() {
    console.log('GestionPacientesPage - ionViewDidEnter');
    
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToTop(0);
      }
    }, 100);
  }

  cargarDatosIniciales() {
    this.cargando = true;
    this.error = '';
    this.pacientesFamilia = [];
    this.pacientesFiltrados = [];
    this.familias = [];
    
    console.log('Cargando datos iniciales...');
    
    this.pacientesService.getPacienteById(this.pacienteActualId).subscribe({
      next: (paciente) => {
        this.pacienteActualNombre = paciente?.nombrePaciente || 'Paciente Principal';
        console.log('Paciente actual cargado:', this.pacienteActualNombre);
        this.cargarFamiliasYMiembros(); 
      },
      error: (err) => {
        console.error('Error cargando paciente actual:', err);
        this.pacienteActualNombre = 'Paciente Principal';
        this.cargarFamiliasYMiembros();
      }
    });
  }

  cargarFamiliasYMiembros() {
    console.log('Cargando familias y miembros con sincronización en tiempo real...');
    
    if (this.familiasSyncSub) {
      this.familiasSyncSub.unsubscribe();
    }

    this.familiasSyncSub = this.familiaRealtimeService.getFamiliasConSync(this.pacienteActualId).subscribe({
      next: (familias) => {
        console.log('Familias encontradas (sync):', familias);
        
        if (!familias || familias.length === 0) {
          console.log('No hay familias, creando familia única...');
          this.crearFamiliaUnicaParaPacienteActual();
        } else {
          console.log('Familias encontradas, procesando miembros...');
          this.procesarFamiliasYMiembros(familias);
        }
      },
      error: (err) => {
        console.error('Error al cargar familias:', err);
        this.error = 'Error al cargar el grupo familiar';
        this.cargando = false;
      }
    });
  }

  private suscribirseACambiosTiempoReal() {
    if (this.realtimeSub) {
      return;
    }

    this.realtimeSub = this.familiaRealtimeService.familiasChanged$.subscribe(cambio => {
      console.log('Cambio detectado en familias:', cambio.evento);
      this.cargarFamiliasYMiembros();
    });
  }

  private procesarFamiliasYMiembros(familias: any) {
    try {
      this.familias = Array.isArray(familias) ? familias : (familias?.data || []);
      console.log(`${this.familias.length} familias procesadas`);
      console.log('Contenido familias:', JSON.stringify(this.familias));

      const todosLosMiembros: Paciente[] = [];
      
      this.familias.forEach((familia: Familia) => {
        console.log(`Procesando familia ${familia.idFamilia} con ${familia.miembros?.length || 0} miembros`);
        
        if (familia.miembros && Array.isArray(familia.miembros)) {
          familia.miembros.forEach((miembro: any) => {
            const paciente = miembro.paciente || miembro;
            if (paciente && paciente.idPaciente) {
              console.log(`Agregando paciente: ${paciente.nombrePaciente} (ID: ${paciente.idPaciente})`);
              todosLosMiembros.push({
                idPaciente: paciente.idPaciente,
                nombrePaciente: paciente.nombrePaciente || 'Paciente sin nombre',
                fechaNacimiento: paciente.fechaNacimiento,
                correo: paciente.correo || null,
                telefono: paciente.telefono || null,
                direccion: paciente.direccion || null,
                sexo: paciente.sexo,
                nacionalidad: paciente.nacionalidad || null,
                ocupacion: paciente.ocupacion || null,
                prevision: paciente.prevision || null,
                tipoSangre: paciente.tipoSangre || null,
                fotoPerfil: paciente.fotoPerfil || null
              });
            }
          });
        }
      });

      const pacientesUnicos = this.eliminarDuplicados(todosLosMiembros);
      
      this.pacientesFamilia = pacientesUnicos.sort((a, b) => 
        (a.nombrePaciente || '').localeCompare(b.nombrePaciente || '')
      );

      console.log(`Total pacientes únicos cargados: ${this.pacientesFamilia.length}`);
      console.log('Lista pacientes:', this.pacientesFamilia.map(p => `${p.idPaciente}-${p.nombrePaciente}`));
      
      this.pacientesFiltrados = this.pacientesFamilia;
      this.calcularEstadisticas();
      this.inicializado = true;
      this.cargando = false;

    } catch (error) {
      console.error('Error procesando familias y miembros:', error);
      this.error = 'Error al procesar los datos del grupo familiar';
      this.cargando = false;
    }
  }

  private eliminarDuplicados(pacientes: Paciente[]): Paciente[] {
    const visto = new Set<number>();
    return pacientes.filter(paciente => {
      if (visto.has(paciente.idPaciente)) {
        return false;
      }
      visto.add(paciente.idPaciente);
      return true;
    });
  }

  private crearFamiliaUnicaParaPacienteActual() {
    console.log('Creando familia única...');
    
    this.familiaService.crearFamilia({
      nombre: `Familia de ${this.pacienteActualNombre}`,
      descripcion: 'Grupo familiar principal',
      idOwner: this.pacienteActualId
    }).subscribe({
      next: (nuevaFamilia) => {
        console.log('Familia única creada:', nuevaFamilia);
        
        // Agregar al paciente actual como miembro
        this.familiaService.agregarMiembro(
          nuevaFamilia.idFamilia,
          this.pacienteActualId,
          'administrador',
          this.pacienteActualId
        ).subscribe({
          next: () => {
            console.log('Paciente actual agregado a la familia');
            // Recargar los datos completos
            this.cargarFamiliasYMiembros();
          },
          error: (err) => {
            console.warn('Paciente actual ya estaba en la familia:', err);
            // Aún así recargar los datos
            this.cargarFamiliasYMiembros();
          }
        });
      },
      error: (err) => {
        console.error('Error al crear familia:', err);
        this.error = 'No se pudo crear el grupo familiar';
        this.cargando = false;
      }
    });
  }

  private calcularEstadisticas() {
    this.estadisticas.totalPacientes = this.pacientesFamilia.length;
    this.estadisticas.totalFamilias = this.familias.length;
    
    // Calcular pacientes con fichas incompletas (sin tipo de sangre o previsión)
    this.estadisticas.sinFichaCompleta = this.pacientesFamilia.filter(p => 
      !p.tipoSangre || !p.prevision
    ).length;
    
    // Calcular alertas (pacientes sin teléfono o con tipo de sangre O-)
    this.estadisticas.conAlertas = this.pacientesFamilia.filter(p => 
      !p.telefono || p.tipoSangre === 'O-'
    ).length;

    console.log('Estadísticas calculadas:', this.estadisticas);
  }

  async handleRefresh(event: any) {
    console.log('Pull to refresh activado');
    await this.cargarDatosIniciales();
    event.target.complete();
  }

  onBusquedaCambiada(termino: string) {
    this.terminoBusqueda = termino.toLowerCase();

    if (!termino) {
      this.pacientesFiltrados = this.pacientesFamilia;
      return;
    }

    this.pacientesFiltrados = this.pacientesFamilia.filter(p =>
      (p.nombrePaciente || '').toLowerCase().includes(this.terminoBusqueda) ||
      (p.correo || '').toLowerCase().includes(this.terminoBusqueda) ||
      (p.telefono || '').includes(this.terminoBusqueda) ||
      (p.prevision || '').toLowerCase().includes(this.terminoBusqueda) ||
      (p.ocupacion || '').toLowerCase().includes(this.terminoBusqueda)
    );
  }

  onLimpiarBusqueda() {
    this.terminoBusqueda = '';
    this.pacientesFiltrados = this.pacientesFamilia;
  }

  onRecargar() {
    console.log('Recarga manual solicitada');
    this.cargarDatosIniciales();
  }

  onPacienteSeleccionado(paciente: Paciente) {
    console.log('Paciente seleccionado:', paciente.idPaciente);
    this.router.navigate(['/fichas/verFicha', paciente.idPaciente], {
      replaceUrl: false,
      state: { 
        pacienteActualId: this.pacienteActualId,
        pacienteActualNombre: this.pacienteActualNombre
      }
    }).then(() => {
      // Scroll al top después de navegar - CORREGIDO
      setTimeout(() => {
        if (this.ionContent) {
          this.ionContent.scrollToTop(0);
        }
      }, 50);
    });
  }

  onAgregarPaciente() {
    console.log('Agregar nuevo paciente');
    this.router.navigate(['/fichas/crear-paciente'], {
      replaceUrl: false
    });
  }

  onAgregarPacienteAFamilia(familiaId: number) {
    console.log('Agregar paciente a familia:', familiaId);
    this.router.navigate(['/fichas/crear-paciente'], {
      replaceUrl: false,
      state: { familiaId }
    });
  }

  async onAgregarFamilia() {
    console.log('Agregar nueva familia');
    
    const alert = await this.alertController.create({
      header: 'Nueva Familia',
      message: 'Crea un nuevo grupo familiar',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la familia',
          attributes: {
            required: true
          }
        },
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.nombre || data.nombre.trim() === '') {
              await this.mostrarToast('El nombre de la familia es requerido', 'warning');
              return false;
            }
            
            this.familiaService.crearFamilia({
              nombre: data.nombre.trim(),
              descripcion: data.descripcion?.trim() || '',
              idOwner: this.pacienteActualId
            }).subscribe({
              next: async (nuevaFamilia) => {
                console.log('Familia creada:', nuevaFamilia);
                
                // Agregar al propietario (paciente 1) como administrador
                this.familiaService.agregarMiembro(
                  nuevaFamilia.idFamilia,
                  this.pacienteActualId,
                  'administrador',
                  this.pacienteActualId
                ).subscribe({
                  next: async () => {
                    console.log('Propietario agregado a la familia como administrador');
                    await this.mostrarToast('Familia creada exitosamente', 'success');
                    this.familiaRealtimeService.notifyFamiliaCreada(nuevaFamilia);
                    this.cargarDatosIniciales();
                  },
                  error: async (err) => {
                    console.warn('Propietario ya estaba en la familia:', err);
                    await this.mostrarToast('Familia creada (propietario ya estaba)', 'success');
                    this.cargarDatosIniciales();
                  }
                });
              },
              error: async (err) => {
                console.error('Error al crear familia:', err);
                await this.mostrarToast('Error al crear la familia', 'danger');
              }
            });
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }

  onVerTodasFamilias() {
    console.log('Ver todas las familias - Función no implementada aún');
  }

  trackByFamiliaId(index: number, familia: Familia): number {
    return familia.idFamilia;
  }

  trackByMiembroId(index: number, miembro: any): number {
    return miembro.idPaciente || index;
  }

  ngOnDestroy() {
    this.familiasSyncSub?.unsubscribe();
    this.realtimeSub?.unsubscribe();
  }

  async onEditarFamilia(familia: Familia) {
    console.log('Editar familia:', familia.idFamilia);
    
    const alert = await this.alertController.create({
      header: 'Editar Familia',
      message: 'Actualiza el nombre de la familia',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la familia',
          value: familia.nombre,
          attributes: {
            required: true
          }
        },
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción (opcional)',
          value: familia.descripcion || ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.nombre || data.nombre.trim() === '') {
              await this.mostrarToast('El nombre de la familia es requerido', 'warning');
              return false;
            }
            
            this.familiaService.actualizarFamilia(familia.idFamilia, {
              nombre: data.nombre.trim(),
              descripcion: data.descripcion?.trim() || undefined
            }).subscribe({
              next: async (familiaActualizada) => {
                console.log('Familia actualizada');
                await this.mostrarToast('Familia actualizada exitosamente', 'success');
                // Notificar cambios en tiempo real
                this.familiaRealtimeService.notifyFamiliaActualizada(familiaActualizada);
                // Recargar los datos
                this.cargarDatosIniciales();
              },
              error: async (err) => {
                console.error('Error actualizando familia:', err);
                await this.mostrarToast('Error al actualizar la familia', 'danger');
              }
            });
            return true;
          }
        }
      ]
    });
    
    await alert.present();
  }

  async onEliminarFamilia(familia: Familia) {
    console.log('Eliminar familia:', familia.idFamilia);
    
    const alert = await this.alertController.create({
      header: 'Eliminar Familia',
      message: `¿Estás seguro de que deseas eliminar la familia "${familia.nombre}"? Todos los miembros serán removidos de esta familia. Esta acción no se puede deshacer.`,
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
            this.familiaService.eliminarFamilia(familia.idFamilia).subscribe({
              next: async () => {
                console.log('Familia eliminada');
                await this.mostrarToast('Familia eliminada exitosamente', 'success');
                // Notificar cambios en tiempo real
                this.familiaRealtimeService.notifyFamiliaEliminada(familia.idFamilia, familia.idOwner);
                // Recargar las familias
                this.cargarDatosIniciales();
              },
              error: async (err) => {
                console.error('Error eliminando familia:', err);
                await this.mostrarToast('Error al eliminar la familia', 'danger');
              }
            });
          }
        }
      ]
    });
    
    await alert.present();
  }

  async onEditarRolMiembro(idFamilia: number, miembro: any) {
    const rolesDisponibles = [
      { value: 'familiar', label: 'Familiar' },
      { value: 'hijo', label: 'Hijo/Hija' },
      { value: 'padre', label: 'Padre/Madre' },
      { value: 'pareja', label: 'Pareja' },
      { value: 'tutor', label: 'Tutor' },
      { value: 'administrador', label: 'Administrador' }
    ];

    const alert = await this.alertController.create({
      header: 'Cambiar Rol del Miembro',
      message: `Cambiar rol de ${miembro.paciente?.nombrePaciente}`,
      inputs: rolesDisponibles.map(rol => ({
        name: 'rol',
        type: 'radio',
        label: rol.label,
        value: rol.value,
        checked: miembro.rol === rol.value
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (nuevoRol) => {
            if (nuevoRol === miembro.rol) {
              return;
            }
            
            this.familiaService.actualizarRolMiembro(idFamilia, miembro.idPaciente, nuevoRol).subscribe({
              next: async () => {
                console.log('Rol actualizado:', nuevoRol);
                miembro.rol = nuevoRol;
                await this.mostrarToast(`Rol actualizado a "${nuevoRol}"`, 'success');
                this.familiaRealtimeService.notifyFamiliaActualizada({ ...this.familias.find(f => f.idFamilia === idFamilia), miembros: [] } as any);
              },
              error: async (err) => {
                console.error('Error actualizando rol:', err);
                await this.mostrarToast('Error al actualizar el rol', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async onEliminarMiembroDeFamilia(idFamilia: number, miembro: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Miembro',
      message: `¿Estás seguro de que deseas eliminar a ${miembro.paciente?.nombrePaciente} de esta familia?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            this.familiaService.eliminarMiembro(idFamilia, miembro.idPaciente).subscribe({
              next: async () => {
                console.log('Miembro eliminado');
                await this.mostrarToast('Miembro eliminado exitosamente', 'success');
                this.cargarDatosIniciales();
              },
              error: async (err) => {
                console.error('Error eliminando miembro:', err);
                await this.mostrarToast('Error al eliminar el miembro', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}