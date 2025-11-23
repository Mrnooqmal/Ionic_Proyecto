import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-familia-stats',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './familia-stats.component.html',
  styleUrls: ['./familia-stats.component.scss']
})
export class FamiliaStatsComponent {
  @Input() estadisticas: { totalPacientes: number; conAlertas: number; sinFichaCompleta: number; totalFamilias: number } | null = null;
}
