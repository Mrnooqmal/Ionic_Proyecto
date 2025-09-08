import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem} from '@ionic/angular/standalone';



@Component({
  selector: 'app-dc',
  templateUrl: './dc.page.html',
  styleUrls: ['./dc.page.scss'],
  standalone:true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonButton, IonLabel, IonItem],
})

export class DcPage {
    description = 'DC Comics es una de las principales editoriales de cómics en el mundo, conocida por sus icónicos superhéroes como Superman,Batman,Flash, etc... Fundada en 1934, el padre de los Comics de superherores';
    foto = 'assets/companias_comics/dc.jpg';
    constructor() { }
    MostrarDescripcionDc() {
        return this.description;
    }
    MostrarFotoDc() {
        return this.foto;
    }   
    ngOnInit() {
    }

    }   