import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BuscarFichasPage } from './gestion-pacientes.page';
import { FamiliaService } from '../../../core/servicios/familias.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Paciente } from '../../../core/servicios/pacientes.service';

describe('BuscarFichasPage', () => {
  let component: BuscarFichasPage;
  let fixture: ComponentFixture<BuscarFichasPage>;
  let familiaServiceSpy: jasmine.SpyObj<FamiliaService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockFamiliaService = jasmine.createSpyObj('FamiliaService', ['getFamiliasPorPaciente']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BuscarFichasPage],
      providers: [
        { provide: FamiliaService, useValue: mockFamiliaService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarFichasPage);
    component = fixture.componentInstance;
    familiaServiceSpy = TestBed.inject(FamiliaService) as jasmine.SpyObj<FamiliaService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los familiares correctamente', fakeAsync(() => {
    const mockPacientes: Paciente[] = [
      { 
        idPaciente: 1, nombrePaciente: 'Juan Pérez', fechaNacimiento: '', correo: 'juan@x.com',
        telefono: '123', direccion: '', sexo: 'M', nacionalidad: '', ocupacion: '',
        prevision: '', tipoSangre: '', created_at: '', updated_at: ''
      },
      { 
        idPaciente: 2, nombrePaciente: 'María Pérez', fechaNacimiento: '', correo: 'maria@x.com',
        telefono: '456', direccion: '', sexo: 'F', nacionalidad: '', ocupacion: '',
        prevision: '', tipoSangre: '', created_at: '', updated_at: ''
      }
    ];

    const mockFamilias = [
      { idFamilia: 1, nombre: 'Familia Pérez', idOwner: 1, miembros: [
        { idFamilia: 1, idPaciente: 1, rol: 'Padre', fechaAgregado: '2025-11-02', paciente: mockPacientes[0] },
        { idFamilia: 1, idPaciente: 2, rol: 'Hija', fechaAgregado: '2025-11-02', paciente: mockPacientes[1] }
      ]}
    ];

    familiaServiceSpy.getFamiliasPorPaciente.and.returnValue(of(mockFamilias));

    component.cargarFamiliares();
    tick();

    expect(component.familias.length).toBe(1);
    expect(component.pacientesFamilia.length).toBe(2);
    expect(component.pacientesFiltrados.length).toBe(2);
    expect(component.cargando).toBeFalse();
  }));

  it('debería manejar errores al cargar los familiares', fakeAsync(() => {
    familiaServiceSpy.getFamiliasPorPaciente.and.returnValue(throwError(() => new Error('Error')));

    component.cargarFamiliares();
    tick();

    expect(component.error).toContain('No se pudieron cargar los familiares');
    expect(component.cargando).toBeFalse();
  }));

  it('debería filtrar pacientes correctamente', () => {
    component.pacientesFamilia = [
      { 
        idPaciente: 1, nombrePaciente: 'Juan Pérez', fechaNacimiento: '', correo: 'juan@x.com',
        telefono: '123', direccion: '', sexo: 'M', nacionalidad: '', ocupacion: '',
        prevision: 'Fonasa', tipoSangre: '', created_at: '', updated_at: ''
      },
      { 
        idPaciente: 2, nombrePaciente: 'María Gómez', fechaNacimiento: '', correo: 'maria@x.com',
        telefono: '456', direccion: '', sexo: 'F', nacionalidad: '', ocupacion: '',
        prevision: 'Isapre', tipoSangre: '', created_at: '', updated_at: ''
      }
    ];

    component.onBusquedaCambiada('maria');
    expect(component.pacientesFiltrados.length).toBe(1);
    expect(component.pacientesFiltrados[0].nombrePaciente).toContain('María');
  });

  it('debería limpiar la búsqueda', () => {
    component.pacientesFamilia = [
      { idPaciente: 1, nombrePaciente: 'Juan Pérez', fechaNacimiento: '', correo: '', telefono: '', direccion: '', sexo: '', nacionalidad: '', ocupacion: '', prevision: '', tipoSangre: '', created_at: '', updated_at: '' }
    ];
    component.terminoBusqueda = 'juan';
    component.pacientesFiltrados = [];

    component.onLimpiarBusqueda();

    expect(component.terminoBusqueda).toBe('');
    expect(component.pacientesFiltrados.length).toBe(1);
  });

  it('debería navegar a ver ficha del paciente', () => {
    const paciente = { idPaciente: 5 } as Paciente;
    component.onPacienteSeleccionado(paciente);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/verFicha', 5]);
  });

  it('debería navegar a crear paciente al agregar', () => {
    component.onAgregarPaciente();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/crear-paciente']);
  });
});
