import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarvelPage } from './marvel.page';

describe('MarvelPage', () => {
  let component: MarvelPage;
  let fixture: ComponentFixture<MarvelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MarvelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
