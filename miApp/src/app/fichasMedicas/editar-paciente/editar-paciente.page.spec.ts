import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarPaciente } from './editar-paciente.page';

describe('EditarPacienteComponent', () => {
  let component: EditarPaciente;
  let fixture: ComponentFixture<EditarPaciente>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditarPaciente],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
