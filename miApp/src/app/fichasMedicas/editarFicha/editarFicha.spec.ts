import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarFichaPage } from './editarFicha.page';
import { ActivatedRoute, Router } from '@angular/router';

describe('EditarFichaPage', () => {
  let component: EditarFichaPage;
  let fixture: ComponentFixture<EditarFichaPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditarFichaPage],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFichaPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia obtener el ID de la ficha desde la ruta', () => {
    expect(component.fichaId).toBe('1');
    expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('deberia tener datos de ficha precargados', () => {
    expect(component.ficha.nombre).toBe('Miguel');
    expect(component.ficha.apellido).toBe('Torres');
    expect(component.ficha.rut).toBe('21.437.567-3');
    expect(component.ficha.tipoSangre).toBe('AB-');
  });

  it('deberia tener tipos de sangre disponibles', () => {
    expect(component.tiposSangre.length).toBe(8);
    expect(component.tiposSangre).toContain('AB-');
    expect(component.tiposSangre).toContain('O+');
  });

  it('deberia guardar cambios y navegar de vuelta', () => {
    spyOn(console, 'log');
    component.guardarCambios();
    
    expect(console.log).toHaveBeenCalledWith('Guardando cambios en la ficha:', component.ficha);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/verFicha', '1']);
  });

  it('deberia cancelar edicion y navegar de vuelta', () => {
    component.cancelarEdicion();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/verFicha', '1']);
  });

  it('deberia volver atras correctamente', () => {
    component.volverAtras();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/verFicha', '1']);
  });
});