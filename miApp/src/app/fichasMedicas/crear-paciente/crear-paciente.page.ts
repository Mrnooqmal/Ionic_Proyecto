import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonButtons, IonIcon, IonBackButton, IonToast
} from '@ionic/angular/standalone';
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
      this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
        next: (familias) => {
          if (familias && familias.length > 0) {
            // ✅ USAR LA PRIMERA FAMILIA EXISTENTE
            const familiaId = familias[0].idFamilia;
            console.log('🏠 Usando familia existente del paciente:', familiaId);
            resolve(familiaId);
          } else {
            console.log('🏠 Creando NUEVA familia única para paciente:', this.pacienteActualId);
            this.crearFamiliaUnica().then(resolve).catch(reject);
          }
        },
        error: (err) => {
          console.error('Error al obtener familias:', err);
          this.crearFamiliaUnica().then(resolve).catch(reject);
        }
      });
    });
  }

  private crearFamiliaUnica(): Promise<number> {
    return new Promise((resolve, reject) => {
      const nombreFamilia = `Familia de ${this.pacienteActualNombre}`;
      
      this.familiaService.crearFamilia({
        nombre: nombreFamilia,
        descripcion: 'Grupo familiar principal',
        idOwner: this.pacienteActualId
      }).subscribe({
        next: (nuevaFamilia) => {
          console.log('🏠 Nueva familia única creada:', nuevaFamilia.idFamilia);
          
          this.familiaService.agregarMiembro(
            nuevaFamilia.idFamilia,
            this.pacienteActualId,
            'administrador', // Rol como administrador
            this.pacienteActualId
          ).subscribe({
            next: () => {
              console.log('✅ Paciente actual agregado a su propia familia');
              resolve(nuevaFamilia.idFamilia);
            },
            error: (err) => {
              console.warn('⚠️ Paciente actual ya estaba en la familia, continuando...', err);
              resolve(nuevaFamilia.idFamilia); 
            }
          });
        },
        error: (err) => {
          console.error('❌ Error al crear familia:', err);
          reject(err);
        }
      });
    });
  }

  private agregarMiembroAFamilia(familiaId: number, paciente: Paciente) {
    const rol = (paciente as any).rolFamiliar || 'familiar';

    console.log('    DEBUG - Agregando miembro:');
    console.log('  - Familia ID:', familiaId);
    console.log('  - Paciente ID:', paciente.idPaciente);
    console.log('  - Rol:', rol);
    console.log('  - Paciente actual (owner):', this.pacienteActualId);

    this.familiaService.agregarMiembro(
      familiaId, 
      paciente.idPaciente, 
      rol, 
      this.pacienteActualId
    ).subscribe({
      next: (response) => {
        console.log('✅ DEBUG - Respuesta del servidor:', response);
        console.log('Paciente agregado al grupo familiar:', response);
        this.mostrarMensaje(`Paciente creado y agregado como ${rol}`, 'success');
        this._redirigirDespuesDeCrear();
      },
      error: (err) => {
        console.error('❌ DEBUG - Error al agregar miembro:', err);
        console.error('❌ Error al agregar miembro a familia:', err);
        const mensajeError = err?.error?.message || 'Error al vincular al grupo familiar';
        this.mostrarMensaje(`Paciente creado, pero ${mensajeError.toLowerCase()}`, 'error');
        this._redirigirDespuesDeCrear(); 
      }
    });
  }

  private _redirigirDespuesDeCrear() {
    setTimeout(() => {
      this.router.navigate(['/fichas/buscarFichas']);
    }, 2000);
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