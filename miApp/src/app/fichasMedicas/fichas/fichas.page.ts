import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, addCircle, search } from 'ionicons/icons';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.page.html',
  styleUrls: ['./fichas.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent]
})
export class FichasPage implements OnInit {

  constructor() {
    addIcons({ home, addCircle, search });
  }

  ngOnInit() {
  }

}