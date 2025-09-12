import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarFichasPage } from './buscarFichas.page';
import { Router } from '@angular/router';

describe('BuscarFichasPage', () => {
  let component: BuscarFichasPage;
  let fixture: ComponentFixture<BuscarFichasPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BuscarFichasPage],
      providers: [
        { provide: Router, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarFichasPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia filtrar fichas por nombre', () => {
    const evento = { target: { value: 'Miguel' } };
    component.buscarPorNombre(evento);
    
    expect(component.fichasFiltradas.length).toBe(1);
    expect(component.fichasFiltradas[0].nombre).toBe('Miguel');
    expect(component.busquedaRealizada).toBe(true);
  });

  it('deberia filtrar fichas por RUT', () => {
    component.rutBusqueda = '21.437.567-3';
    component.buscarPorRut();
    
    expect(component.fichasFiltradas.length).toBe(1);
    expect(component.fichasFiltradas[0].rut).toBe('21.437.567-3');
  });

  it('deberia limpiar busqueda correctamente', () => {
    component.rutBusqueda = 'test';
    component.fichasFiltradas = [component.fichasEjemplo[0]];
    component.busquedaRealizada = true;
    
    component.limpiarBusqueda();
    
    expect(component.rutBusqueda).toBe('');
    expect(component.fichasFiltradas.length).toBe(0);
    expect(component.busquedaRealizada).toBe(false);
  });

  it('deberia navegar a ver ficha', () => {
    const fichaId = 1;
    component.verFicha(fichaId);
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/ver', fichaId]);
  });

  it('deberia mostrar mensaje cuando no hay resultados', () => {
    component.rutBusqueda = 'noexiste';
    component.buscarPorRut();
    
    expect(component.fichasFiltradas.length).toBe(0);
    expect(component.busquedaRealizada).toBe(true);
  });
});