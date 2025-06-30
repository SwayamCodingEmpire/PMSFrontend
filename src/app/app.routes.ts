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
import { ManagerTimesheetComponent } from './components/delivery-manager/manager-timesheet/manager-timesheet.component';

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
      { path : 'dashboard', component: DmDashboardComponent},
      { path : 'project-list', component: ProjectListComponent }, // Placeholder for project-list component
      { path : 'resource', component: ResourcesComponent }, // Placeholder for resource component
      { path : 'time-sheet', component: ManagerTimesheetComponent } // Placeholder for time-sheet component
    ]
  },
  {
    path: 'resource',
    component: ResourceLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path : 'dashboard', component: ResourceDashboardComponent },
      { path : 'time-sheet', component: ResourceTimesheetComponent } // Placeholder for time-sheet component
    ]
  },
    {
    path: 'project-manager',
    component: ProjectManagerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path : 'dashboard', component: PmDashboardComponent},
      { path : 'project-list', component: ProjectListComponent }, // Placeholder for project-list component
      { path : 'resource', component: ResourcesComponent }, // Placeholder for resource component
      { path : 'time-sheet', component: ManagerTimesheetComponent } // Placeholder for time-sheet component
    ]
  }
];
