import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarFichasPage } from './buscarFichas.page';
import { Router } from '@angular/router';
import { PacientesService } from '../../../core/servicios/pacientes.service';
import { of, throwError } from 'rxjs';

describe('BuscarFichasPage', () => {
  let component: BuscarFichasPage;
  let fixture: ComponentFixture<BuscarFichasPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let pacientesServiceSpy: jasmine.SpyObj<PacientesService>;

  const mockPacientes = [
    {
      idPaciente: 1,
      nombrePaciente: 'Miguel Torres',
      fechaNacimiento: '1989-05-15',
      correo: 'miguel@email.com',
      telefono: '+56912345678',
      direccion: 'Av. Principal 123',
      sexo: 'masculino',
      nacionalidad: 'Chilena',
      ocupacion: 'Ingeniero',
      prevision: 'FONASA',
      tipoSangre: 'AB-',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      idPaciente: 2,
      nombrePaciente: 'Ana García',
      fechaNacimiento: '1992-08-20',
      correo: 'ana.garcia@email.com',
      telefono: '+56987654321',
      direccion: 'Calle Secundaria 456',
      sexo: 'femenino',
      nacionalidad: 'Chilena',
      ocupacion: 'Doctora',
      prevision: 'ISAPRE',
      tipoSangre: 'O+',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const pacientesServiceSpyObj = jasmine.createSpyObj('PacientesService', ['getPacientes']);

    await TestBed.configureTestingModule({
      imports: [BuscarFichasPage],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: PacientesService, useValue: pacientesServiceSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarFichasPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    pacientesServiceSpy = TestBed.inject(PacientesService) as jasmine.SpyObj<PacientesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty values', () => {
    expect(component.pacientes).toEqual([]);
    expect(component.pacientesFiltrados).toEqual([]);
    expect(component.cargando).toBeFalse();
    expect(component.error).toBe('');
    expect(component.terminoBusqueda).toBe('');
  });

  it('should load pacientes on init', () => {
    pacientesServiceSpy.getPacientes.and.returnValue(of(mockPacientes));
    
    component.ngOnInit();
    
    expect(pacientesServiceSpy.getPacientes).toHaveBeenCalled();
    expect(component.pacientes).toEqual(mockPacientes);
    expect(component.pacientesFiltrados).toEqual(mockPacientes);
    expect(component.cargando).toBeFalse();
  });

  it('should handle error when loading pacientes', () => {
    const errorMessage = 'Error de conexión';
    pacientesServiceSpy.getPacientes.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Error al cargar los pacientes');
    expect(component.cargando).toBeFalse();
  });

  it('should filter pacientes by search term', () => {
    component.pacientes = mockPacientes;
    component.pacientesFiltrados = mockPacientes;
    
    component.onBusquedaCambiada('miguel');
    
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toBe('Miguel Torres');
  });

  it('should clear search and show all pacientes', () => {
    component.pacientes = mockPacientes;
    component.pacientesFiltrados = [mockPacientes[0]];
    component.terminoBusqueda = 'miguel';
    
    component.onLimpiarBusqueda();
    
    expect(component.terminoBusqueda).toBe('');
    expect(component.pacientesFiltrados).toEqual(mockPacientes);
  });

  it('should reload pacientes', () => {
    spyOn(component, 'cargarPacientes');
    
    component.onRecargar();
    
    expect(component.cargarPacientes).toHaveBeenCalled();
  });

  it('should navigate to patient ficha when selected', () => {
    const paciente = mockPacientes[0];
    
    component.onPacienteSeleccionado(paciente);
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/verFicha', paciente.idPaciente]);
  });

  it('should navigate to create ficha when adding patient', () => {
    component.onAgregarPaciente();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/crearFichas']);
  });

  it('should filter by multiple criteria', () => {
    component.pacientes = mockPacientes;
    
    // Test nombre
    component.onBusquedaCambiada('ana');
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toBe('Ana García');
    
    // Test email
    component.onBusquedaCambiada('miguel@email.com');
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toBe('Miguel Torres');
    
    // Test teléfono
    component.onBusquedaCambiada('87654321');
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toBe('Ana García');
    
    // Test previsión
    component.onBusquedaCambiada('isapre');
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toBe('Ana García');
  });
});