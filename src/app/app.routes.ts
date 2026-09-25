import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'pistas',
    loadComponent: () => import('./features/pistas/pistas').then((m) => m.Pistas),
  },
  {
    path: 'reservar',
    loadComponent: () => import('./features/reservas/reservar').then((m) => m.Reservar),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
        data: { title: 'Dashboard' },
      },
      {
        path: 'pistas',
        loadComponent: () =>
          import('./features/admin/courts/admin-courts').then((m) => m.AdminCourts),
        data: { title: 'Pistas' },
      },
    ],
  },
];
