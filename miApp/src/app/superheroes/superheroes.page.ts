import { Component } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonText , IonSelect, IonSelectOption, IonButton} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 



@Component({
  selector: 'app-superheroes',
  templateUrl: './superheroes.page.html',
  styleUrls: ['./superheroes.page.scss'],
  standalone: true,

  imports: [
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonText,
    IonButton,

  ] 
})
export class SuperheroesPage {
    superheroes: string[] = [
        "Spider-Man",
        "Daredevil",
        "Captain America",
        "Batman"
    ];

    resultado: string | null = null;
    constructor() { }
    ObtenerSuperheroe() {
        const random = Math.floor(Math.random() * this.superheroes.length);
        this.resultado = this.superheroes[random];
    }

    mostrarFotoSuperheroe(superheroe: string): string {
        switch(superheroe) {
            case 'Spider-Man':
                return 'assets/fotos_superheroes/spiderman.jpg';
            case 'Daredevil':
                return 'assets/fotos_superheroes/daredevil.jpg';
            case 'Captain America':
                return 'assets/fotos_superheroes/captainamerica.jpg';
            case 'Batman':
                return 'assets/fotos_superheroes/batman.jpg';
            default:
                return '';
        }
    }

    obtenerCompaniaSuperheroe(superheroe: string): string {
        switch (superheroe) {
          case 'Spider-Man':
          case 'Daredevil':
          case 'Captain America':
            return 'Marvel Comics';
          case 'Batman':
            return 'DC Comics';
          default:
            return '';
        }
      }
      

    ngOnInit() {
    }
}