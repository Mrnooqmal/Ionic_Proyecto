import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroesPage } from './superheroes.page';

describe('SuperheroesPage', () => {
  let component: SuperheroesPage;
  let fixture: ComponentFixture<SuperheroesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperheroesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
