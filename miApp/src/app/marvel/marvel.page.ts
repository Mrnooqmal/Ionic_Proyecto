import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem} from '@ionic/angular/standalone';


@Component({
  selector: 'app-marvel',
  templateUrl: './marvel.page.html',
  styleUrls: ['./marvel.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButton, IonLabel, IonItem],
  standalone: true
})
export class MarvelPage {

    description = 'Marvel es una compañía de entretenimiento conocida por sus cómics, películas y series... Nació en 1939 y es la hija de DC Comics';
    foto = 'assets/companias_comics/marvel.jpg';
    constructor() { }
    MostrarDescripcionMarvel() {
        return this.description;
    }
    MostrarFotoMarvel() {
        return this.foto;
    }
    ngOnInit() {
    }

    }


