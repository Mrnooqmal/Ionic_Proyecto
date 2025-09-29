import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerFichaPage } from './verFicha.page';

describe('VerFichaPage', () => {
  let component: VerFichaPage;
  let fixture: ComponentFixture<VerFichaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerFichaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VerFichaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patient data', () => {
    expect(component.ficha).toBeDefined();
  });

  it('should format allergies text correctly', () => {
    component.ficha = {
      paciente: {} as any,
      alergias: [{ alergia: 'Penicilina', observacion: 'Severa' }]
    } as any;
    
    const result = component.getAlergiasTexto();
    expect(result).toContain('Penicilina');
  });
});