import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormularioPacienteComponent } from './formulario-paciente.component';

describe('FormularioPacienteComponent', () => {
  let component: FormularioPacienteComponent;
  let fixture: ComponentFixture<FormularioPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormularioPacienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
