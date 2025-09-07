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
      titulo: 'Estadísticas',
      descripcion: 'Análisis de Datos',
      detalles: 'Visualiza y analiza datos estadísticos con gráficos interactivos y métricas detalladas.',
      ruta: '/estadisticas',
      icono: 'bar-chart-outline',
      color: 'primary'
    },
    {
      titulo: 'Calculadora',
      descripcion: 'Calculadora Científica',
      detalles: 'Realiza cálculos básicos con una interfaz intuitiva y fácil de usar.',
      ruta: '/calculadora',
      icono: 'calculator-outline',
      color: 'tertiary'
    },
    {
      titulo: 'Inversiones',
      descripcion: 'Simulador de Inversiones',
      detalles: 'Calcula el crecimiento de tus inversiones con interés compuesto y diferentes frecuencias de aportes.',
      ruta: '/inversiones',
      icono: 'trending-up-outline',
      color: 'warning'
    },
    {
      titulo: 'Tareas',
      descripcion: 'Gestor de Tareas',
      detalles: 'Organiza y gestiona tus tareas diarias con seguimiento visual de progreso.',
      ruta: '/tareas',
      icono: 'checkbox-outline',
      color: 'secondary'
    },
    {
      titulo: 'Conversor',
      descripcion: 'Conversor de Monedas',
      detalles: 'Convierte entre diferentes monedas con tipos de cambio actualizados.',
      ruta: '/conversor',
      icono: 'swap-horizontal-outline',
      color: 'medium'
    },
    {
      titulo: 'Clima',
      descripcion: 'Dashboard del Clima',
      detalles: 'Consulta las condiciones climáticas actuales de diferentes ciudades de Chile.',
      ruta: '/clima',
      icono: 'cloudy-outline',
      color: 'dark'
    },
    {
      titulo: 'Animales',
      descripcion: 'Enciclopedia de Animales',
      detalles: 'Descripcion aca.',
      ruta: '/animales',
      icono: 'paw-outline',
      color: 'success'
    }
  ];

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}