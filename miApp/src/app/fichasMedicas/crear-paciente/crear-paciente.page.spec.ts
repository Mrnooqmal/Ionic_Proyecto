import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearPaciente } from './crear-paciente.page';

describe('CrearPacienteComponent', () => {
  let component: CrearPaciente;
  let fixture: ComponentFixture<CrearPaciente>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
