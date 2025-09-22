import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonText , IonButton, IonInput} from '@ionic/angular/standalone';

@Component({
  selector: 'app-animales',
  templateUrl: './animales.page.html',
  styleUrls: ['./animales.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonText, IonButton, IonInput] 
})
export class AnimalesPage implements OnInit {

  numero_animales: number | null = null;

  constructor() { }

  ngOnInit() {
  }

}
