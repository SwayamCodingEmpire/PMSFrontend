import { Routes } from '@angular/router';
import { LoginComponent } from './components/shared/login/login.component';
import { DeliveryManagerLayoutComponent } from './components/delivery-manager/delivery-manager-layout/delivery-manager-layout.component';
import { ResourceLayoutComponent } from './components/resource/resource-layout/resource-layout.component';
import { ProjectManagerLayoutComponent } from './components/project-manager/project-manager-layout/project-manager-layout.component';
import { DmDashboardComponent } from './components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { PmDashboardComponent } from './components/project-manager/pm-dashboard/pm-dashboard.component';
import { ResourceDashboardComponent } from './components/resource/resource-dashboard/resource-dashboard.component';
import { ResourceTimesheetComponent } from './components/resource/resource-timesheet/resource-timesheet.component';
import { ProjectListComponent } from './components/delivery-manager/project-list/project-list.component';
import { ResourcesComponent } from './components/delivery-manager/resources/resources.component';
import { ManagerTimesheetComponent } from './components/project-manager/manager-timesheet/manager-timesheet.component';
import { AddProjectsComponent } from './components/delivery-manager/add-projects/add-projects.component';
import { AssignResourceAllocationComponent } from './components/project-manager/assign-resources/assign-resources.component';
import { ViewAllocationsComponent } from './components/project-manager/view-allocations/view-allocations.component';
import { authGuard } from './guards/auth.guard';

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
        canActivate: [authGuard],
    data: { roles: ['DELIVERY_MANAGER', 'PROJECT_MANAGER'] },
    component: DeliveryManagerLayoutComponent,
    children: [
      // ✅ Default admin route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DmDashboardComponent },
      { path: 'project-list', component: ProjectListComponent }, // Placeholder for project-list component
      { path: 'resource', component: ResourcesComponent }, // Placeholder for resource component
      { path: 'time-sheet', component: ManagerTimesheetComponent },// Placeholder for time-sheet component
      { path: 'add-projects', component: AddProjectsComponent, data: { mode: 'add' } },
      { path: 'edit-projects/:projectCode', component: AddProjectsComponent, data: { mode: 'edit' } },
      { path : 'view-allocations/:projectCode', component: ViewAllocationsComponent }
    ]
  },
  {
    path: 'resource',
            canActivate: [authGuard],
    data: { role: 'RESOURCE' },
    component: ResourceLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ResourceDashboardComponent },
      { path: 'time-sheet', component: ResourceTimesheetComponent } // Placeholder for time-sheet component
    ]
  },
  {
    path: 'project-manager',
            canActivate: [authGuard],
    data: { roles: ['DELIVERY_MANAGER', 'PROJECT_MANAGER'] },
    component: ProjectManagerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PmDashboardComponent },
      { path: 'project-list', component: ProjectListComponent }, // Placeholder for project-list component
      { path: 'resource', component: ResourcesComponent }, // Placeholder for resource component
      { path: 'time-sheet', component: ManagerTimesheetComponent }, // Placeholder for time-sheet component
      { path: 'allocate-resources/:projectCode', component: AssignResourceAllocationComponent },
      { path : 'view-allocations/:projectCode', component: ViewAllocationsComponent } // Placeholder for view allocations component
    ]
  }
];
