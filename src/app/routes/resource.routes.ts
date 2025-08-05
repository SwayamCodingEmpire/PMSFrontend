// routes/resource.routes.ts
import { Routes } from '@angular/router';
import { ResourceLayoutComponent } from '../components/resource/resource-layout/resource-layout.component';
import { ResourceDashboardComponent } from '../components/resource/resource-dashboard/resource-dashboard.component';
import { ResourceTimesheetComponent } from '../components/resource/resource-timesheet/resource-timesheet.component';

export const RESOURCE_ROUTES: Routes = [
  {
    path: '',
    component: ResourceLayoutComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        component: ResourceDashboardComponent
      },
      { 
        path: 'time-sheet', 
        component: ResourceTimesheetComponent
      }
    ]
  }
];