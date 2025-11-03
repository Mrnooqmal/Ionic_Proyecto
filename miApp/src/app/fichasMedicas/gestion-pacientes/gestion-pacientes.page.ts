import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,    
  IonRefresher, IonRefresherContent, 
  IonButtons, IonBackButton, IonSpinner, IonText, IonCard, IonCardContent,
  IonIcon, IonFab, IonFabButton, IonFabList, IonAvatar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, refresh, person, add, personAdd, people, medical } from 'ionicons/icons';

import { BusquedaPacientesComponent } from '../../../compartidos/componentes/busqueda-pacientes/busqueda-pacientes.component';
import { ListaPacientesFamiliaComponent } from '../../../compartidos/componentes/lista-pacientes-familia/lista-pacientes-familia.component';
import { PacientesService, Paciente } from '../../../core/servicios/pacientes.service';
import { FamiliaService, Familia } from '../../../core/servicios/familias.service';

@Component({
  selector: 'app-gestion-pacientes',
  templateUrl: './gestion-pacientes.page.html',
  styleUrls: ['./gestion-pacientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonButtons, IonBackButton,
    IonSpinner, IonText, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent, 
    IonIcon, IonFab, IonFabButton, IonFabList,IonAvatar,
    BusquedaPacientesComponent,
    ListaPacientesFamiliaComponent
  ]
})
export class GestionPacientesPage implements OnInit {
  
  familias: Familia[] = [];
  pacientesFamilia: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  cargando = false;
  error = '';
  terminoBusqueda = '';

  pacienteActualId = 1; 
  pacienteActualNombre = 'Paciente Principal';

  // NUEVAS ESTADÍSTICAS
  estadisticas = {
    totalPacientes: 0,
    conAlertas: 0,
    sinFichaCompleta: 0,
    totalFamilias: 0
  };

  constructor(
    private familiaService: FamiliaService,
    private pacientesService: PacientesService,
    private router: Router
  ) {
    addIcons({ arrowBack, refresh, person, add, personAdd, people, medical });
  }

  ngOnInit() {
    this.cargarPacienteActual();
  }

  ionViewWillEnter() {
    this.cargarFamiliares();
  }

  cargarPacienteActual() {
    this.pacientesService.getPacienteById(this.pacienteActualId).subscribe({
      next: (paciente) => {
        this.pacienteActualNombre = paciente?.nombrePaciente || 'Paciente Principal';
        this.inicializarFamiliaPacienteActual(); 
      },
      error: () => {
        this.pacienteActualNombre = 'Paciente Principal';
        this.inicializarFamiliaPacienteActual();
      }
    });
  }

  inicializarFamiliaPacienteActual() {
    this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
      next: (familias) => {
        console.log('Familias encontradas:', familias);
        
        if (!familias || familias.length === 0) {
          console.log('🏠 Inicializando familia única para paciente:', this.pacienteActualId);
          this.crearFamiliaUnicaParaPacienteActual();
        } else {
          console.log('✅ Familia ya existe, cargando miembros...');
          this.cargarFamiliares(); 
        }
      },
      error: (err) => {
        console.error('❌ Error al verificar familias:', err);
        this.crearFamiliaUnicaParaPacienteActual();
      }
    });
  }

  private crearFamiliaUnicaParaPacienteActual() {
    this.familiaService.crearFamilia({
      nombre: `Familia de ${this.pacienteActualNombre}`,
      descripcion: 'Grupo familiar principal',
      idOwner: this.pacienteActualId
    }).subscribe({
      next: (nuevaFamilia) => {
        console.log('✅ Familia única creada para paciente actual:', nuevaFamilia);
        
        this.familiaService.agregarMiembro(
          nuevaFamilia.idFamilia,
          this.pacienteActualId,
          'administrador',
          this.pacienteActualId
        ).subscribe({
          next: () => {
            console.log('✅ Paciente actual agregado a su familia');
            this.cargarFamiliares(); 
          },
          error: (err) => {
            console.warn('⚠️ Paciente actual ya estaba en la familia:', err);
            this.cargarFamiliares(); 
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al crear familia:', err);
        this.error = 'No se pudo crear el grupo familiar';
        this.cargando = false;
      }
    });
  }

  cargarFamiliares(): Promise<void> {
    return new Promise((resolve) => {
      this.cargando = true;
      this.error = '';

      console.log('🔍 Cargando familias para paciente:', this.pacienteActualId);

      this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
        next: (familias) => {
          console.log('🔍 Familias recibidas del servidor:', familias);
          
          try {
            const resultado: any = familias;
            this.familias = Array.isArray(resultado) ? resultado : (resultado?.data ?? []);

            console.log('🔍 Familias procesadas:', this.familias);

            this.pacientesFamilia = this.familias.reduce((acc: Paciente[], f: Familia) => {
              if (f.miembros && Array.isArray(f.miembros)) {
                const miembros = f.miembros
                  .map(m => {
                    const paciente = m.paciente || m;
                    return paciente;
                  })
                  .filter((p): p is Paciente => !!(p && p.idPaciente));
                return [...acc, ...miembros];
              }
              return acc;
            }, []);

            console.log('🔍 Pacientes en familia final:', this.pacientesFamilia);
            
            // CALCULAR NUEVAS ESTADÍSTICAS
            this.calcularEstadisticas();
            
            this.pacientesFiltrados = this.pacientesFamilia;
            this.cargando = false;
            resolve();
          } catch (error) {
            console.error('❌ Error procesando datos de familia:', error);
            this.error = 'Error al procesar los datos';
            this.cargando = false;
            resolve();
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar grupo familiar:', err);
          this.error = 'No se pudieron cargar los familiares';
          this.cargando = false;
          resolve();
        }
      });
    });
  }

  // NUEVO MÉTODO PARA CALCULAR ESTADÍSTICAS
  private calcularEstadisticas() {
    this.estadisticas.totalPacientes = this.pacientesFamilia.length;
    this.estadisticas.totalFamilias = this.familias.length;
    
    // Calcular pacientes con fichas incompletas (sin tipo de sangre o previsión)
    this.estadisticas.sinFichaCompleta = this.pacientesFamilia.filter(p => 
      !p.tipoSangre || !p.prevision
    ).length;
    
    // Calcular alertas (aquí puedes personalizar la lógica)
    this.estadisticas.conAlertas = this.pacientesFamilia.filter(p => 
      p.tipoSangre === 'O-' || !p.telefono // Ejemplo de alertas
    ).length;
  }

  async handleRefresh(event: any) {
    await this.cargarFamiliares();
    event.target.complete();
  }

  onBusquedaCambiada(termino: string) {
    this.terminoBusqueda = termino.toLowerCase();

    if (!termino) {
      this.pacientesFiltrados = this.pacientesFamilia;
      return;
    }

    this.pacientesFiltrados = this.pacientesFamilia.filter(p =>
      p.nombrePaciente.toLowerCase().includes(this.terminoBusqueda) ||
      p.correo?.toLowerCase().includes(this.terminoBusqueda) ||
      p.telefono?.includes(this.terminoBusqueda) ||
      p.prevision?.toLowerCase().includes(this.terminoBusqueda)
    );
  }

  onLimpiarBusqueda() {
    this.terminoBusqueda = '';
    this.pacientesFiltrados = this.pacientesFamilia;
  }

  onRecargar() {
    this.cargarFamiliares();
  }

  onPacienteSeleccionado(paciente: Paciente) {
    this.router.navigate(['/fichas/verFicha', paciente.idPaciente]);
  }

  onAgregarPaciente() {
    this.router.navigate(['/fichas/crear-paciente']);
  }

  // NUEVOS MÉTODOS PARA GESTIÓN DE FAMILIAS
  onAgregarFamilia() {
    // Navegar a creación de nueva familia
    console.log('Agregar nueva familia');
    // this.router.navigate(['/familias/crear']);
  }

  onVerTodasFamilias() {
    // Navegar a gestión de familias
    console.log('Ver todas las familias');
    // this.router.navigate(['/familias']);
  }

  onVerEstadisticas() {
    // Navegar a estadísticas detalladas
    console.log('Ver estadísticas detalladas');
    // this.router.navigate(['/estadisticas']);
  }
}