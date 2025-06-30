import { Routes } from '@angular/router';
import { LoginComponent } from './components/shared/login/login.component';
import { DeliveryManagerLayoutComponent } from './components/delivery-manager/delivery-manager-layout/delivery-manager-layout.component';
import { ResourceLayoutComponent } from './components/resource/resource-layout/resource-layout.component';
import { ProjectManagerLayoutComponent } from './components/project-manager/project-manager-layout/project-manager-layout.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'delivery-manager',
    component: DeliveryManagerLayoutComponent,
    children: [
      // ✅ Default admin route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  {
    path: 'resource',
    component: ResourceLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
    {
    path: 'project-manager',
    component: ProjectManagerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];
