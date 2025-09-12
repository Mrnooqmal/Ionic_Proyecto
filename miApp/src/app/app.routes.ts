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
  {
    path: 'marvel',
    loadComponent: () => import('./marvel/marvel.page').then(m => m.MarvelPage)
  },
  {
    path: 'dc',
    loadComponent: () => import('./dc/dc.page').then(m => m.DcPage)
  },
  {
    path: 'fichas',
    loadComponent: () => import('./fichasMedicas/fichas/fichas.page').then(m => m.FichasPage)
  },
  {
    path: 'fichas/crearFichas',
    loadComponent: () => import('./fichasMedicas/crearFicha/crearFicha.page').then(m => m.CrearFichaPage)
  },
  {
    path: 'fichas/buscarFichas',
    loadComponent: () => import('./fichasMedicas/buscarFichas/buscarFichas.page').then(m => m.BuscarFichasPage)
  },
  {
    path: 'fichas/verFicha/:id',
    loadComponent: () => import('./fichasMedicas/verFicha/verFicha.page').then(m => m.VerFichaPage)
  },
  {
    path: 'fichas/editarFicha/:id',
    loadComponent: () => import('./fichasMedicas/editarFicha/editarFicha.page').then(m => m.EditarFichaPage)
  },
];
