import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccionesPacienteComponent } from './acciones-paciente.component';

describe('AccionesPacienteComponent', () => {
  let component: AccionesPacienteComponent;
  let fixture: ComponentFixture<AccionesPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AccionesPacienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccionesPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
