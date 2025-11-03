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
    path: 'dashboard',
    loadComponent: () => import('./dashboard/home-dashboard.page').then((m) => m.HomeDashboardPage),
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
    path: 'fichas/gestion-pacientes',
    loadComponent: () => import('./fichasMedicas/gestion-pacientes/gestion-pacientes.page').then(m => m.GestionPacientesPage)
  },
  {
    path: 'fichas/verFicha/:id',
    loadComponent: () => import('./fichasMedicas/verFicha/verFicha.page').then(m => m.VerFichaPage)
  },
  {
    path: 'fichas/editarFicha/:id',
    loadComponent: () => import('./fichasMedicas/editarFicha/editarFicha.page').then(m => m.EditarFichaPage)
  },
  {
    path: 'fichas/crear-paciente',
    loadComponent: () => import('./fichasMedicas/crear-paciente/crear-paciente.page').then(m => m.CrearPaciente)
  },
  {
    path: 'fichas/editar-paciente/:id',
    loadComponent: () => import('./fichasMedicas/editar-paciente/editar-paciente.page').then(m => m.EditarPaciente)
  }
];
