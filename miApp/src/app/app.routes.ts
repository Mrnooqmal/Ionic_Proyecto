import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'fichas',
    pathMatch: 'full',
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
  }

];
