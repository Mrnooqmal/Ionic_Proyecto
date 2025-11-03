import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./fichasMedicas/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'fichas',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/home-dashboard.page').then(m => m.HomeDashboardPage),
  },
  {
    path: 'fichas/crearFichas',
    loadComponent: () => import('./fichasMedicas/crearFicha/crearFicha.page').then(m => m.CrearFichaPage)
  },
  {
    path: 'gestion-pacientes',
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