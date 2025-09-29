import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListaPacientesFamiliaComponent } from './lista-pacientes-familia.component';

describe('ListaPacientesFamiliaComponent', () => {
  let component: ListaPacientesFamiliaComponent;
  let fixture: ComponentFixture<ListaPacientesFamiliaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ListaPacientesFamiliaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPacientesFamiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
