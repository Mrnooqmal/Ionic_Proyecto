import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerFichaPage } from './verFicha.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('VerFichaPage', () => {
  let component: VerFichaPage;
  let fixture: ComponentFixture<VerFichaPage>;
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
      imports: [VerFichaPage],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerFichaPage);
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

  it('deberia navegar a editar ficha', () => {
    component.editarFicha();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/editarFicha', '1']);
  });

  it('deberia navegar de vuelta a buscar fichas', () => {
    component.volverAtras();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/fichas/buscarFichas']);
  });

  it('deberia llamar window.print al imprimir', () => {
    spyOn(window, 'print');
    component.imprimirFicha();
    expect(window.print).toHaveBeenCalled();
  });

  it('deberia cargar la ficha en ngOnInit', () => {
    spyOn(component, 'cargarFicha');
    component.ngOnInit();
    expect(component.cargarFicha).toHaveBeenCalled();
  });
});