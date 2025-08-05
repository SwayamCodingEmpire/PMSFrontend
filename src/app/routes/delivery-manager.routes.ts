// routes/delivery-manager.routes.ts
import { Routes } from '@angular/router';
import { DeliveryManagerLayoutComponent } from '../components/delivery-manager/delivery-manager-layout/delivery-manager-layout.component';
import { DmDashboardComponent } from '../components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { ProjectListComponent } from '../components/delivery-manager/project-list/project-list.component';
import { ResourcesComponent } from '../components/delivery-manager/resources/resources.component';
import { ManagerTimesheetComponent } from '../components/project-manager/manager-timesheet/manager-timesheet.component';
import { AddProjectsComponent } from '../components/delivery-manager/add-projects/add-projects.component';
import { AssignResourceAllocationComponent } from '../components/project-manager/assign-resources/assign-resources.component';
import { ViewAllocationsComponent } from '../components/project-manager/view-allocations/view-allocations.component';
import { ProjectTypeMasterComponent } from '../components/delivery-manager/project-type-master/project-type-master.component';
import { SkillMasterComponent } from '../components/delivery-manager/skill-master/skill-master.component';

export const DELIVERY_MANAGER_ROUTES: Routes = [
  {
    path: '',
    component: DeliveryManagerLayoutComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        component: DmDashboardComponent
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
        path: 'add-projects', 
        component: AddProjectsComponent,
        data: { mode: 'add' }
      },
      { 
        path: 'edit-projects/:projectCode', 
        component: AddProjectsComponent,
        data: { mode: 'edit' }
      },
      { 
        path: 'allocate-resources/:projectCode', 
        component: AssignResourceAllocationComponent
      },
      { 
        path: 'view-allocations/:projectCode', 
        component: ViewAllocationsComponent
      },
      { 
        path: 'project-type-master', 
        component: ProjectTypeMasterComponent
      },
      { 
        path: 'skills-master', 
        component: SkillMasterComponent
      }
    ]
  }
];