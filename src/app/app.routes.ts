// app.routes.ts - Ultra minimal initial load
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
    loadComponent: () => import('./components/shared/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'delivery-manager',
    canActivate: [authGuard],
    data: { role: 'DELIVERY_MANAGER' },
    loadComponent: () => import('./components/delivery-manager/delivery-manager-layout/delivery-manager-layout.component')
      .then(m => m.DeliveryManagerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/delivery-manager/dm-dashboard/dm-dashboard.component')
          .then(m => m.DmDashboardComponent)
      },
      { 
        path: 'project-list', 
        loadComponent: () => import('./components/delivery-manager/project-list/project-list.component')
          .then(m => m.ProjectListComponent)
      },
      { 
        path: 'resource', 
        loadComponent: () => import('./components/delivery-manager/resources/resources.component')
          .then(m => m.ResourcesComponent)
      },
      { 
        path: 'time-sheet', 
        loadComponent: () => import('./components/project-manager/manager-timesheet/manager-timesheet.component')
          .then(m => m.ManagerTimesheetComponent)
      },
      { 
        path: 'add-projects', 
        loadComponent: () => import('./components/delivery-manager/add-projects/add-projects.component')
          .then(m => m.AddProjectsComponent),
        data: { mode: 'add' }
      },
      { 
        path: 'edit-projects/:projectCode', 
        loadComponent: () => import('./components/delivery-manager/add-projects/add-projects.component')
          .then(m => m.AddProjectsComponent),
        data: { mode: 'edit' }
      },
      { 
        path: 'allocate-resources/:projectCode', 
        loadComponent: () => import('./components/project-manager/assign-resources/assign-resources.component')
          .then(m => m.AssignResourceAllocationComponent)
      },
      { 
        path: 'view-allocations/:projectCode', 
        loadComponent: () => import('./components/project-manager/view-allocations/view-allocations.component')
          .then(m => m.ViewAllocationsComponent)
      },
      { 
        path: 'project-type-master', 
        loadComponent: () => import('./components/delivery-manager/project-type-master/project-type-master.component')
          .then(m => m.ProjectTypeMasterComponent)
      },
      { 
        path: 'skills-master', 
        loadComponent: () => import('./components/delivery-manager/skill-master/skill-master.component')
          .then(m => m.SkillMasterComponent)
      }
    ]
  },
  {
    path: 'resource',
    canActivate: [authGuard],
    data: { role: 'RESOURCE' },
    loadComponent: () => import('./components/resource/resource-layout/resource-layout.component')
      .then(m => m.ResourceLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/resource/resource-dashboard/resource-dashboard.component')
          .then(m => m.ResourceDashboardComponent)
      },
      { 
        path: 'time-sheet', 
        loadComponent: () => import('./components/resource/resource-timesheet/resource-timesheet.component')
          .then(m => m.ResourceTimesheetComponent)
      }
    ]
  },
  {
    path: 'project-manager',
    canActivate: [authGuard],
    data: { role: 'PROJECT_MANAGER' },
    loadComponent: () => import('./components/project-manager/project-manager-layout/project-manager-layout.component')
      .then(m => m.ProjectManagerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/project-manager/pm-dashboard/pm-dashboard.component')
          .then(m => m.PmDashboardComponent)
      },
      { 
        path: 'project-list', 
        loadComponent: () => import('./components/delivery-manager/project-list/project-list.component')
          .then(m => m.ProjectListComponent)
      },
      { 
        path: 'resource', 
        loadComponent: () => import('./components/delivery-manager/resources/resources.component')
          .then(m => m.ResourcesComponent)
      },
      { 
        path: 'time-sheet', 
        loadComponent: () => import('./components/project-manager/manager-timesheet/manager-timesheet.component')
          .then(m => m.ManagerTimesheetComponent)
      },
      { 
        path: 'allocate-resources/:projectCode', 
        loadComponent: () => import('./components/project-manager/assign-resources/assign-resources.component')
          .then(m => m.AssignResourceAllocationComponent)
      },
      { 
        path: 'view-allocations/:projectCode', 
        loadComponent: () => import('./components/project-manager/view-allocations/view-allocations.component')
          .then(m => m.ViewAllocationsComponent)
      }
    ]
  }
];