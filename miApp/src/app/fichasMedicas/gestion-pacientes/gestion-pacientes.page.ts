import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,    
  IonRefresher, IonRefresherContent, 
  IonButtons, IonBackButton, IonSpinner, IonCard, IonCardContent,
  IonIcon, IonAvatar 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBack, refresh, person, add, personAdd, people, medical,
  search, alertCircle, checkmarkCircle, time, informationCircle 
} from 'ionicons/icons';

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
    IonButtons, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent,
    IonIcon, IonAvatar, IonBackButton, IonSpinner,
    BusquedaPacientesComponent,
    ListaPacientesFamiliaComponent
  ]
})
export class GestionPacientesPage implements OnInit {
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

  constructor(
    private familiaService: FamiliaService,
    private pacientesService: PacientesService,
    private router: Router
  ) {
    addIcons({ 
      arrowBack, refresh, person, add, personAdd, people, medical,
      search, alertCircle, checkmarkCircle, time, informationCircle 
    });
  }

  ngOnInit() {
    console.log('GestionPacientesPage - ngOnInit - Carga inicial');
    this.cargarDatosIniciales();
  }

  ionViewDidEnter() {
    console.log('GestionPacientesPage - ionViewDidEnter - Vista visible');
    
    // Scroll al top cuando la vista se carga
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToTop(0);
      }
    }, 100);
    
    // Solo recargar si ya estaba inicializado pero necesitamos datos frescos
    if (this.inicializado && (this.pacientesFamilia.length === 0 || this.error)) {
      console.log('Recargando datos porque la vista está visible pero hay problemas');
      this.cargarDatosIniciales();
    }
  }

  cargarDatosIniciales() {
    this.cargando = true;
    this.error = '';
    
    console.log('Cargando datos iniciales...');
    
    // Primero cargar el paciente actual
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
    console.log('Cargando familias y miembros...');
    this.familiaService.getFamiliasPorPaciente(this.pacienteActualId).subscribe({
      next: (familias) => {
        console.log('Familias encontradas:', familias);
        
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

  private procesarFamiliasYMiembros(familias: any) {
    try {
      // Procesar las familias recibidas
      this.familias = Array.isArray(familias) ? familias : (familias?.data || []);
      console.log(`${this.familias.length} familias procesadas`);

      // Extraer y procesar todos los miembros de todas las familias
      const todosLosMiembros: Paciente[] = [];
      
      this.familias.forEach((familia: Familia) => {
        if (familia.miembros && Array.isArray(familia.miembros)) {
          familia.miembros.forEach((miembro: any) => {
            // El miembro puede ser el paciente directamente o tener una propiedad paciente
            const paciente = miembro.paciente || miembro;
            if (paciente && paciente.idPaciente) {
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

      // Eliminar duplicados por idPaciente
      const pacientesUnicos = this.eliminarDuplicados(todosLosMiembros);
      
      // Ordenar por nombre
      this.pacientesFamilia = pacientesUnicos.sort((a, b) => 
        (a.nombrePaciente || '').localeCompare(b.nombrePaciente || '')
      );

      console.log(`${this.pacientesFamilia.length} pacientes únicos cargados`);
      
      // Actualizar datos filtrados y estadísticas
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
      replaceUrl: false
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
    console.log('➕ Agregar nuevo paciente');
    this.router.navigate(['/fichas/crear-paciente'], {
      replaceUrl: false
    });
  }

  // MÉTODOS FALTANTES - AGREGADOS
  onAgregarFamilia() {
    console.log('Agregar nueva familia - Función no implementada aún');
    // this.router.navigate(['/familias/crear']);
  }

  onVerTodasFamilias() {
    console.log('Ver todas las familias - Función no implementada aún');
    // this.router.navigate(['/familias']);
  }
}