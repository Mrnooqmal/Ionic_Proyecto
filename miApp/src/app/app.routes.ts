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
    path: 'dashboard',
    loadComponent: () => import('./dashboard/home-dashboard.page').then(m => m.HomeDashboardPage),
  },
  {
    path: 'fichas/crearFichas',
    redirectTo: 'examenes',
    pathMatch: 'full'
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
  },
  // Rutas temporales para consultas, recetas y exámenes (redirigen a home por ahora)
  {
    path: 'buscar-fichas',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'consultas',
    loadComponent: () => import('./consultas/consultas.page').then(m => m.ConsultasPage)
  },
  {
    path: 'recetas',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'examenes',
    loadComponent: () => import('./examenes/examenes.page').then(m => m.ExamenesPage)
  },
  {
    path: 'examenes/crear',
    loadComponent: () => import('./examenes/crear-examen.page').then(m => m.CrearExamenPage)
  },
  {
    path: 'examenes/cargar',
    loadComponent: () => import('./examenes/cargar-examen.page').then(m => m.CargarExamenPage)
  },
  {
    path: 'configuracion',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'familia',
    redirectTo: 'gestion-pacientes',
    pathMatch: 'full'
  }
];