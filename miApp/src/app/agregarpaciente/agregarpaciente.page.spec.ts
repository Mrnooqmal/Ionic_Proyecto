import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarpacientePage } from './agregarpaciente.page';

describe('AgregarpacientePage', () => {
  let component: AgregarpacientePage;
  let fixture: ComponentFixture<AgregarpacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarpacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
