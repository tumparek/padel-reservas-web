import { Routes } from '@angular/router';

export const routes: Routes = [
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
