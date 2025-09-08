import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'animales',
    loadComponent: () => import('./animales/animales.page').then(m => m.AnimalesPage)
  },
  {
    path: 'animales/noticias-animal/:animal',
    loadComponent: () => import('./animales/noticias-animal/noticias-animal.page').then(m => m.NoticiasAnimalPage)
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./estadisticas/estadisticas.page').then( m => m.EstadisticasPage)
  },
  {
    path: 'calculadora',
    loadComponent: () => import('./calculadora/calculadora.page').then( m => m.CalculadoraPage)
  },
  {
    path: 'inversiones',
    loadComponent: () => import('./inversiones/inversiones.page').then( m => m.InversionesPage)
  },
  {
    path: 'tareas',
    loadComponent: () => import('./tareas/tareas.page').then( m => m.TareasPage)
  },
  {
    path: 'conversor',
    loadComponent: () => import('./conversor/conversor.page').then( m => m.ConversorPage)
  },
  {
    path: 'clima',
    loadComponent: () => import('./clima/clima.page').then( m => m.ClimaPage)
  },
  {
    path: 'superheroes',
    loadComponent: () => import('./superheroes/superheroes.page').then(m => m.SuperheroesPage)
  },
  {
    path: 'anime',
    loadComponent: () => import('./anime/anime.page').then(m => m.AnimePage)
  },
];
