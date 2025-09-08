import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoticiasAnimalPage } from './noticias-animal.page';

describe('NoticiasAnimalPage', () => {
  let component: NoticiasAnimalPage;
  let fixture: ComponentFixture<NoticiasAnimalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiasAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
