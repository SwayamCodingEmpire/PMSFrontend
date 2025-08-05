// app.routes.ts - EVERYTHING is lazy loaded
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/shared/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'delivery-manager',
    canActivate: [authGuard],
    data: { role: 'DELIVERY_MANAGER' },
    loadChildren: () => import('./routes/delivery-manager.routes').then(m => m.DELIVERY_MANAGER_ROUTES)
  },
  {
    path: 'resource',
    canActivate: [authGuard],
    data: { role: 'RESOURCE' },
    loadChildren: () => import('./routes/resource.routes').then(m => m.RESOURCE_ROUTES)
  },
  {
    path: 'project-manager',
    canActivate: [authGuard],
    data: { role: 'PROJECT_MANAGER' },
    loadChildren: () => import('./routes/project-manager.routes').then(m => m.PROJECT_MANAGER_ROUTES)
  }
];