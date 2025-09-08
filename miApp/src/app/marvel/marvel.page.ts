import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marvel',
  templateUrl: './marvel.page.html',
  styleUrls: ['./marvel.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButton, IonLabel, IonItem, RouterModule],
  standalone: true
})
export class MarvelPage {

    description = 'Marvel es una compañía de entretenimiento conocida por sus cómics, películas y series... Nació en 1939 y es la hija de DC Comics';
    foto = 'assets/companias_comics/marvel.jpg';

    mostrarTexto = ''; 
    mostrarImagen = '';  
  
    constructor() { }
    MostrarDescripcionMarvel() {
        this.mostrarTexto= this.description;
        return this.mostrarTexto
    }
    MostrarFotoMarvel() {
        this.mostrarImagen= this.foto;
        return this.mostrarImagen
    }
    ngOnInit() {
    }

    }


