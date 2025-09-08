import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-noticias-animal',
  templateUrl: './noticias-animal.page.html',
  styleUrls: ['./noticias-animal.page.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonText]
})
export class NoticiasAnimalPage implements OnInit {
  animalSeleccionado: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.animalSeleccionado = this.route.snapshot.paramMap.get('animal');
  }

  getNoticias(): string[] {
    switch (this.animalSeleccionado) {
      case 'Gato':
        return ['Un gatito llegó a la ciudad', 'Los gatos dominan internet'];
      case 'Perro':
        return ['Un perro rescatado se convierte en héroe', 'Los perros son los mejores enemigos del hombre'];
      case 'Conejo':
        return ['Conejo viral por sus habilidades de canto', 'Conejos roban verduras'];
      case 'Capibara':
        return ['Los capibaras invaden Venezuela', 'Capibara gana concurso de ternura'];
      default:
        return [];
    }
  }
}
