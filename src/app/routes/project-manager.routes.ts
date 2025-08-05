// routes/project-manager.routes.ts
import { Routes } from '@angular/router';
import { ProjectManagerLayoutComponent } from '../components/project-manager/project-manager-layout/project-manager-layout.component';
import { PmDashboardComponent } from '../components/project-manager/pm-dashboard/pm-dashboard.component';
import { ProjectListComponent } from '../components/delivery-manager/project-list/project-list.component';
import { ResourcesComponent } from '../components/delivery-manager/resources/resources.component';
import { ManagerTimesheetComponent } from '../components/project-manager/manager-timesheet/manager-timesheet.component';
import { AssignResourceAllocationComponent } from '../components/project-manager/assign-resources/assign-resources.component';
import { ViewAllocationsComponent } from '../components/project-manager/view-allocations/view-allocations.component';

export const PROJECT_MANAGER_ROUTES: Routes = [
  {
    path: '',
    component: ProjectManagerLayoutComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        component: PmDashboardComponent
      },
      { 
        path: 'project-list', 
        component: ProjectListComponent
      },
      { 
        path: 'resource', 
        component: ResourcesComponent
      },
      { 
        path: 'time-sheet', 
        component: ManagerTimesheetComponent
      },
      { 
        path: 'allocate-resources/:projectCode', 
        component: AssignResourceAllocationComponent
      },
      { 
        path: 'view-allocations/:projectCode', 
        component: ViewAllocationsComponent
      }
    ]
  }
];