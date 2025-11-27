import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonBackButton, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

import { FormularioPacienteComponent } from '../../../compartidos/componentes/formulario-paciente/formulario-paciente.component';
import { Paciente } from  '../../../core/servicios/pacientes.service';
import { PacientesService } from '../../../core/servicios/pacientes.service';
import { FamiliaService } from '../../../core/servicios/familias.service';

@Component({
  selector: 'app-crear-paciente',
  templateUrl: './crear-paciente.page.html',
  styleUrls: ['./crear-paciente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonBackButton, 
    FormularioPacienteComponent,
    IonToast
  ]
})
export class CrearPaciente {

  //paciente actual (temporal: ID 1)
  pacienteActualId = 1;
  pacienteActualNombre = 'Paciente Principal';
  familiaIdSeleccionada?: number;
  
  mostrarToast = false;
  mensajeToast = '';
  tipoToast: 'success' | 'error' = 'success';

  constructor(
    private router: Router, 
    private pacientesService: PacientesService,
    private familiaService: FamiliaService
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    // Obtener familiaId del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['familiaId']) {
      this.familiaIdSeleccionada = navigation.extras.state['familiaId'];
      console.log('Familia seleccionada para agregar miembro:', this.familiaIdSeleccionada);
    } else {
      const state = (window.history.state as any);
      if (state?.familiaId) {
        this.familiaIdSeleccionada = state.familiaId;
        console.log('Familia seleccionada (desde history):', this.familiaIdSeleccionada);
      }
    }

    // Cargar nombre del paciente actual
    this.pacientesService.getPacienteById(this.pacienteActualId).subscribe({
      next: (paciente) => {
        this.pacienteActualNombre = paciente?.nombrePaciente || 'Paciente Principal';
      },
      error: () => {
        this.pacienteActualNombre = 'Paciente Principal';
      }
    });
  }

  onPacienteGuardado(paciente: Paciente) {
    console.log('Paciente recibido en página (YA CREADO):', paciente);

    if (!paciente.idPaciente) {
      console.error('El paciente creado no tiene ID');
      this.mostrarMensaje('Error: Paciente creado sin ID', 'error');
      return;
    }

    this.obtenerOCrearFamiliaUnica().then(familiaId => {
      this.agregarMiembroAFamilia(familiaId, paciente);
    }).catch(err => {
      console.error('Error al obtener/crear familia:', err);
      this.mostrarMensaje('Error al vincular al grupo familiar', 'error');
      this._redirigirDespuesDeCrear();
    });
  }

  private obtenerOCrearFamiliaUnica(): Promise<number> {
    return new Promise((resolve, reject) => {
      // Si ya tenemos una familia seleccionada, usarla
      if (this.familiaIdSeleccionada) {
        console.log('Usando familia seleccionada:', this.familiaIdSeleccionada);
        resolve(this.familiaIdSeleccionada);
        return;
      }

      console.log('Obteniendo familias del paciente:', this.pacienteActualId);
      this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
        next: (familias) => {
          console.log('Familias obtenidas:', familias);
          console.log('Número de familias:', familias ? familias.length : 0);
          
          if (familias && familias.length > 0) {
            const familiaPropia = familias.find((f: any) => f.idOwner === this.pacienteActualId);
            
            if (familiaPropia) {
              console.log('Usando familia propia del paciente, ID:', familiaPropia.idFamilia);
              resolve(familiaPropia.idFamilia);
            } else {
              const familiaId = familias[0].idFamilia;
              console.log('No hay familia propia, usando primera familia disponible, ID:', familiaId);
              resolve(familiaId);
            }
          } else {
            console.log('No hay familias, creando nueva...');
            this.crearFamiliaUnica().then(resolve).catch(reject);
          }
        },
        error: (err) => {
          console.error('Error al obtener familias:', err);
          console.log('Creando nueva familia por error...');
          this.crearFamiliaUnica().then(resolve).catch(reject);
        }
      });
    });
  }

  private crearFamiliaUnica(): Promise<number> {
    return new Promise((resolve, reject) => {
      const nombreFamilia = `Familia de ${this.pacienteActualNombre}`;
      console.log('Creando familia:', nombreFamilia);
      
      this.familiaService.crearFamilia({
        nombre: nombreFamilia,
        descripcion: 'Grupo familiar principal',
        idOwner: this.pacienteActualId
      }).subscribe({
        next: (nuevaFamilia) => {
          console.log('Familia creada, ID:', nuevaFamilia.idFamilia);
          
          this.familiaService.agregarMiembro(
            nuevaFamilia.idFamilia,
            this.pacienteActualId,
            'administrador',
            this.pacienteActualId
          ).subscribe({
            next: () => {
              console.log('Paciente actual agregado a su familia');
              resolve(nuevaFamilia.idFamilia);
            },
            error: (err) => {
              console.warn('Paciente actual ya estaba en familia:', err);
              resolve(nuevaFamilia.idFamilia); 
            }
          });
        },
        error: (err) => {
          console.error('Error creando familia:', err);
          reject(err);
        }
      });
    });
  }

  private agregarMiembroAFamilia(familiaId: number, paciente: Paciente) {
    const rol = (paciente as any).rolFamiliar || 'familiar';

    console.log('DEBUG - Agregando miembro:');
    console.log('  Familia ID:', familiaId);
    console.log('  Paciente ID:', paciente.idPaciente);
    console.log('  Paciente nombre:', paciente.nombrePaciente);
    console.log('  Rol:', rol);
    console.log('  Paciente actual (owner):', this.pacienteActualId);

    this.familiaService.agregarMiembro(
      familiaId, 
      paciente.idPaciente, 
      rol, 
      this.pacienteActualId
    ).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        console.log('Paciente agregado al grupo familiar:', response);
        this.mostrarMensaje(`Paciente creado y agregado como ${rol}`, 'success');
        
        setTimeout(() => {
          this._redirigirDespuesDeCrear();
        }, 800);
      },
      error: (err) => {
        console.error('Error al agregar miembro:', err);
        console.error('Detalles del error:');
        console.error('   - Status:', err?.status);
        console.error('   - Message:', err?.message);
        console.error('   - Error body:', err?.error);
        
        const mensajeError = err?.error?.message || err?.error?.error || 'Error desconocido';
        this.mostrarMensaje(`Paciente creado, pero ${mensajeError.toLowerCase()}`, 'error');
        
        setTimeout(() => {
          this._redirigirDespuesDeCrear();
        }, 1500);
      }
    });
  }

  private _redirigirDespuesDeCrear() {
    setTimeout(() => {
      console.log('Redirigiendo a gestión de pacientes...');
      this.router.navigate(['/gestion-pacientes'], {
        replaceUrl: false
      });
    }, 1500);
  }

  onFormularioCancelado() {
    this.router.navigate(['/fichas/buscarFichas']);
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
  }
}