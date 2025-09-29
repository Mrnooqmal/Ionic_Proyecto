import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusquedaPacientesComponent } from './busqueda-pacientes.component';

describe('BusquedaPacientesComponent', () => {
  let component: BusquedaPacientesComponent;
  let fixture: ComponentFixture<BusquedaPacientesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BusquedaPacientesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
