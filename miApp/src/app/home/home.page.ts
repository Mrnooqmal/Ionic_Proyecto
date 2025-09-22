import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

interface PaginaInfo {
  titulo: string;
  descripcion: string;
  detalles: string;
  ruta: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonIcon, 
    IonText, 
    IonGrid, 
    IonRow, 
    IonCol, 
    CommonModule,
    IonBreadcrumb, 
    IonBreadcrumbs
  ],
})
export class HomePage {
  paginas: PaginaInfo[] = [
    {
      titulo: 'Pacientes',
      descripcion: 'Enciclopedia de Pacientes',
      detalles: 'Datos de pacientes almacenados.',
      ruta: '/pacientes',
      icono: 'paw-outline',
      color: 'success'
    },
    {
      titulo: 'Fichas Médicas',
      descripcion: 'Enciclopedia de Fichas Médicas',
      detalles: 'Datos de fichas médicas almacenados.',
      ruta: '/fichas',
      icono: 'paw-outline',
      color: 'success'
    }
  ];

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}