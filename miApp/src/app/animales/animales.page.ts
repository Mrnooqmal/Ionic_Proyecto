import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonText , IonSelect, IonSelectOption, IonButton} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-animales',
  templateUrl: './animales.page.html',
  styleUrls: ['./animales.page.scss'],
  standalone: true,
  imports: [RouterModule ,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonText, IonButton, IonSelect, IonSelectOption] 
})
export class AnimalesPage implements OnInit {
  AnimalSeleccionado: 'Gato' | 'Perro' | 'Conejo' | 'Capibara' | null = null;

  constructor() { }

  obtenerDescripcionAnimal(animal: string): string {
    switch(animal) {
      case 'Gato':
        return 'Los gatos son animales domésticos conocidos por su independencia y habilidades de caza. El mejor animal, si me preguntas :)';
      case 'Perro':
        return 'Los perros son animales leales y sociales, considerados como los mejores amigos del hombre';
      case 'Conejo':
        return 'Los conejos son pequeños mamíferos herbívoros conocidos por sus largas orejas y su capacidad para saltar. Bugs Bunny referencia';
      case 'Capibara':
        return 'Las capibaras son re tiernos, nativos de suramérica y amigos de todos los animales';
      default:
        return '';
    }
  }

  mostrarFotoAnimal(animal: string): string{
    switch(animal) {
      case 'Gato':
        return 'assets/fotos_animales/gato.jpg';
      case 'Perro':
        return 'assets/fotos_animales/perro.jpg';
      case 'Conejo':
        return 'assets/fotos_animales/conejo.jpg';
      case 'Capibara':
        return 'assets/fotos_animales/capibara.jpg';
      default:
        return '';
    }
  }

  ngOnInit() {
  }

}
