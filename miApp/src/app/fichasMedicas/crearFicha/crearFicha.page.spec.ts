import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearFichaPage } from './crearFicha.page';

describe('CrearFichaPage', () => {
  let component: CrearFichaPage;
  let fixture: ComponentFixture<CrearFichaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearFichaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearFichaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia limpiar el formulario', () => {
    component.nombre = 'Test';
    component.apellido = 'Usuario';
    component.limpiarFormulario();
    
    expect(component.nombre).toBe('');
    expect(component.apellido).toBe('');
  });

  it('deberia guardar la ficha con datos correctos', () => {
    spyOn(console, 'log');
    
    component.nombre = 'Juan';
    component.apellido = 'Perez';
    component.datosPaciente = 'Datos de prueba';
    
    component.guardarFicha();
    
    expect(console.log).toHaveBeenCalled();
  });
});