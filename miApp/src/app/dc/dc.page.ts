import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dc',
  templateUrl: './dc.page.html',
  styleUrls: ['./dc.page.scss'],
  standalone:true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButton, IonLabel, IonItem, RouterModule],
})

export class DcPage {
    description = 'DC Comics es una de las principales editoriales de cómics en el mundo, conocida por sus icónicos superhéroes como Superman,Batman,Flash, etc... Fundada en 1934, el padre de los Comics de superherores';
    foto = 'assets/companias_comics/dc.jpg';

    mostrarImagen = '';  
    mostrarTexto = '';
    constructor() { }
    MostrarDescripcionDc() {
        this.mostrarTexto= this.description;
        return this.mostrarTexto
    }
    MostrarFotoDc() {
        this.mostrarImagen= this.foto;
        return this.mostrarImagen
    }   
    ngOnInit() {
    }

    }   