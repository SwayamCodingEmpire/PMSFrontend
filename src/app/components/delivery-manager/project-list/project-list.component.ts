import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import FormsModule
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectDetailsPayload } from '../../../models/ProjectDetailsPayload ';
import { ToastrService } from 'ngx-toastr';
import { ManagerProjectsService } from '../../../services/manager/manager-projects.service';
import { PaginatedProjectsResponse } from '../../../models/PaginatedProjectPayload';
import { ProjectBasicModel } from '../../../models/ProjectBasicModel';
import { ProjectTransferService } from '../../../services/shared/project-transfer.service';
import { MailNotificationConfig } from '../../../models/MailConfigPayload';
import { ProjectService } from '../../../services/manager/project.service';

declare var bootstrap: any;

@Component({
  selector: 'app-project-list',
  imports: [FormsModule,CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  role:string = '';
  projectForm!: FormGroup;
 mailForm!: FormGroup;
  projectCode: string = 'PROJECT123'; // Replace or fetch dynamically

  daysOfWeek: string[] = ['NONE', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  filteredWarningDay2Options: string[] = [];


 projects: ProjectDetailsPayload[] = [];
  //   {
  //     projectCode: 'PRJ001',
  //     projectName: 'Apollo Dashboard',
  //     customerName: 'Acme Corp',
  //     currency: 'USD',
  //     scheduleStartDate: new Date('2025-06-01'),
  //     scheduleEndDate: new Date('2025-12-01'),
  //     projectManager: 'John Doe'
  //   },
  //   {
  //     projectCode: 'PRJ002',
  //     projectName: 'Orion Tracker',
  //     customerName: 'Beta Ltd',
  //     currency: 'INR',
  //     scheduleStartDate: new Date('2025-05-15'),
  //     scheduleEndDate: new Date('2025-10-15'),
  //     projectManager: 'Jane Smith'
  //   },
  //   {
  //     projectCode: 'PRJ001',
  //     projectName: 'Apollo Dashboard',
  //     customerName: 'Acme Corp',
  //     currency: 'USD',
  //     scheduleStartDate: new Date('2025-06-01'),
  //     scheduleEndDate: new Date('2025-12-01'),
  //     projectManager: 'John Doe'
  //   },
  //   {
  //     projectCode: 'PRJ002',
  //     projectName: 'Orion Tracker',
  //     customerName: 'Beta Ltd',
  //     currency: 'EUR',
  //     scheduleStartDate: new Date('2025-03-15'),
  //     scheduleEndDate: new Date('2025-09-30'),
  //     projectManager: 'Jane Smith'
  //   },
  //   {
  //     projectCode: 'PRJ003',
  //     projectName: 'Luna Analytics',
  //     customerName: 'Gamma Systems',
  //     currency: 'GBP',
  //     scheduleStartDate: new Date('2025-04-10'),
  //     scheduleEndDate: new Date('2025-10-20'),
  //     projectManager: 'Michael Johnson'
  //   },
  //   {
  //     projectCode: 'PRJ004',
  //     projectName: 'Solar CRM',
  //     customerName: 'Delta Solutions',
  //     currency: 'INR',
  //     scheduleStartDate: new Date('2025-02-01'),
  //     scheduleEndDate: new Date('2025-08-01'),
  //     projectManager: 'Emily Davis'
  //   },
  //   {
  //     projectCode: 'PRJ005',
  //     projectName: 'Neptune POS',
  //     customerName: 'Omega Retail',
  //     currency: 'USD',
  //     scheduleStartDate: new Date('2025-01-20'),
  //     scheduleEndDate: new Date('2025-06-30'),
  //     projectManager: 'Chris Evans'
  //   },
  //   {
  //     projectCode: 'PRJ006',
  //     projectName: 'Mercury ERP',
  //     customerName: 'Zenith Corp',
  //     currency: 'CAD',
  //     scheduleStartDate: new Date('2025-07-01'),
  //     scheduleEndDate: new Date('2025-11-30'),
  //     projectManager: 'Sophia Brown'
  //   },
  //   {
  //     projectCode: 'PRJ007',
  //     projectName: 'Venus HRM',
  //     customerName: 'HRNext',
  //     currency: 'AUD',
  //     scheduleStartDate: new Date('2025-05-05'),
  //     scheduleEndDate: new Date('2025-11-05'),
  //     projectManager: 'Liam Wilson'
  //   },
  //   {
  //     projectCode: 'PRJ008',
  //     projectName: 'Jupiter Inventory',
  //     customerName: 'Techwave',
  //     currency: 'USD',
  //     scheduleStartDate: new Date('2025-03-25'),
  //     scheduleEndDate: new Date('2025-09-25'),
  //     projectManager: 'Isabella Lee'
  //   },
  //   {
  //     projectCode: 'PRJ009',
  //     projectName: 'Saturn Finance',
  //     customerName: 'FinNext',
  //     currency: 'EUR',
  //     scheduleStartDate: new Date('2025-02-10'),
  //     scheduleEndDate: new Date('2025-07-20'),
  //     projectManager: 'Noah Clark'
  //   },
  //   {
  //     projectCode: 'PRJ010',
  //     projectName: 'Pluto Reports',
  //     customerName: 'Insight Co.',
  //     currency: 'SGD',
  //     scheduleStartDate: new Date('2025-06-15'),
  //     scheduleEndDate: new Date('2025-12-31'),
  //     projectManager: 'Olivia Hall'
  //   },
  //   {
  //     projectCode: 'PRJ011',
  //     projectName: 'Comet Planner',
  //     customerName: 'Orbit Group',
  //     currency: 'INR',
  //     scheduleStartDate: new Date('2025-01-05'),
  //     scheduleEndDate: new Date('2025-04-30'),
  //     projectManager: 'William Scott'
  //   }
  // ];
  selectedProject: any = null;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalItems = 0;

  warnMailDate = '';
  warnMailTime = '';
  reminderMailDate = '';
  notSUbmittedMail = '';
  reminderMailTime = '';
  searchTerm: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private managerProjectService: ManagerProjectsService,
    private projectTransferService: ProjectTransferService,
    private projectSerivce: ProjectService,
  public route: ActivatedRoute
  ) {
this.mailForm = new FormGroup({
    timesheetSummaryDay: new FormControl('NONE'),
    timesheetReminderDay: new FormControl('NONE'),
    timesheetWarningDay1: new FormControl('NONE'),
    timesheetWarningDay2: new FormControl('NONE')
  });
   }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.filteredWarningDay2Options = [...this.daysOfWeek];
    this.loadProjects();
  }

  isAllowedForDML(): boolean {
    return this.role === 'DELIVERY_MANAGER';
  }

  loadProjects(): void {
    const page = this.currentPage - 1;
    this.managerProjectService.getAllProjectsForManager(page, this.pageSize, this.searchTerm).subscribe(
      (paginatedData: PaginatedProjectsResponse) => {
        this.projects = paginatedData.content;
         this.totalPages = paginatedData.totalPages;
         this.totalItems = paginatedData.totalElements;
         console.log('Projects loaded:', this.projects);
      },
      error => {
        console.error('Error loading projects:', error);
        this.toastr.error('Failed to load projects', 'Error');
      }
    );
  }


  // Pagination controls
 goToFirstPage(): void {
  if (this.currentPage > 1) {
    this.currentPage = 1;
    this.loadProjects();
  }
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadProjects();
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadProjects();
  }
}

goToLastPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage = this.totalPages;
    this.loadProjects();
  }
}

onPageSizeChange(): void {
  this.currentPage = 1;
  this.loadProjects();
}

  // Search
applySearch(): void {
  this.currentPage = 1;
  this.loadProjects();
}

  openAddModal(): void {
    // implement add logic here if needed
  }

  viewProjectDetails(proj: any): void {
    this.selectedProject = proj;
    const modal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
    modal.show();
  }


// Selection properties
selectedCustomerId: number | null = null;
selectedManagerId: number | null = null;





// Navigation methods





// Update your existing editProject method
editProject(i: number): void {
  console.log('Editing project at index:', i);
  this.selectedProject = this.projects[i];
  console.log('Selected project for editing:', this.selectedProject);
  const projectCode = this.selectedProject.projectCode;
  this.router.navigate(['/delivery-manager/edit-projects', projectCode]);
}




configureEmailProject(proj: any, i: number): void {
  this.openMailModal(proj);
  this.selectedProject = proj;

  const warningDay1 = proj.timesheetWarningDay1 || 'NONE';

  this.mailForm = new FormGroup({
    projectCode: new FormControl(proj.projectCode || ''),
    timesheetWarningDay1: new FormControl(warningDay1),
    timesheetWarningDay2: new FormControl(proj.timesheetWarningDay2 || 'NONE'),
    timesheetReminderDay: new FormControl(proj.timesheetReminderDay || 'NONE'),
    timesheetSummaryDay: new FormControl(proj.timesheetSummaryDay || 'NONE')
  });

  // Filter Day 2 options based on Day 1
  const index = this.daysOfWeek.indexOf(warningDay1);
  this.filteredWarningDay2Options = index >= 0 ? ['NONE', ...this.daysOfWeek.slice(index + 1)] : [...this.daysOfWeek];
}


  onSubmit(): void {
  if (this.projectForm.valid) {
    // Update the selected project with form values
    Object.assign(this.selectedProject, this.projectForm.value);
    // Close modal and save changes
  }
}

  openMailModal(proj: any) {
    this.selectedProject = proj;
    this.projectCode = proj.projectCode;
    this.projectSerivce.getMailConfigByProjectCode(this.projectCode).subscribe(
      (mailConfig: MailNotificationConfig) => {
        this.mailForm.patchValue({
          timesheetSummaryDay: mailConfig.timesheetSummaryDay || 'NONE',
          timesheetReminderDay: mailConfig.timesheetReminderDay || 'NONE',
          timesheetWarningDay1: mailConfig.timesheetWarningDay1 || 'NONE',
          timesheetWarningDay2: mailConfig.timesheetWarningDay2 || 'NONE'
        });
      },
      error => {
        console.error('Error fetching mail configuration:', error);
        this.toastr.error('Failed to load mail configuration', 'Error');
      }
    );
    const modal = new bootstrap.Modal(document.getElementById('mailModal'));
    modal.show();
  }



  gotoAddProject(){
    this.router.navigate(['/delivery-manager/add-projects']);
  }

 

goToResourceAllocationPage(projectCode: string, projectName: string, customerName: string): void {
  const projectForTransfer: ProjectBasicModel = {
    name: projectName,
    code: projectCode,
    customer: customerName
  };

  // Save project context
  this.projectTransferService.setProject(projectForTransfer);
  localStorage.setItem('project', JSON.stringify(projectForTransfer));

  // Determine base route from URL
  const currentUrl = this.router.url;
  let basePath = '';

  if (currentUrl.includes('/project-manager')) {
    basePath = 'project-manager';
  } else if (currentUrl.includes('/delivery-manager')) {
    basePath = 'delivery-manager';
  } else {
    console.warn('Unknown base path. Defaulting to project-manager');
    basePath = 'project-manager'; // fallback or set based on role
  }

  this.router.navigate([`/${basePath}/allocate-resources`, projectCode]);
}






  configure(): void {
    const payload: MailNotificationConfig = {
      timesheetSummaryDay: this.mailForm.get('timesheetSummaryDay')?.value || 'NONE',
      timesheetReminderDay: this.mailForm.get('timesheetReminderDay')?.value || 'NONE',
      timesheetWarningDay1: this.mailForm.get('timesheetWarningDay1')?.value || 'NONE',
      timesheetWarningDay2: this.mailForm.get('timesheetWarningDay2')?.value || 'NONE'
    }
    console.log('Sending mail configuration:', payload);
    this.projectSerivce.configureMailNotification(this.selectedProject.projectCode, payload).subscribe(
      response => {
        console.log('Mail configuration updated successfully:', response);
        this.toastr.success('Mail configuration updated successfully', 'Success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('mailModal'));
        if (modal) {
          modal.hide();
        }
      },
      error => {
        console.error('Error updating mail configuration:', error);
        this.toastr.error('Failed to update mail configuration', 'Error');
      }
    );
  }

    configureDefault(): void {
    const payload: MailNotificationConfig = {
      timesheetSummaryDay: this.mailForm.get('timesheetSummaryDay')?.value || 'NONE',
      timesheetReminderDay: this.mailForm.get('timesheetReminderDay')?.value || 'NONE',
      timesheetWarningDay1: this.mailForm.get('timesheetWarningDay1')?.value || 'NONE',
      timesheetWarningDay2: this.mailForm.get('timesheetWarningDay2')?.value || 'NONE'
    }
    console.log('Sending mail configuration:', payload);
    this.projectSerivce.confilgureDefaultMailConfig(payload).subscribe(
      response => {
        console.log('Mail configuration updated successfully:', response);
        this.toastr.success('Mail configuration updated successfully', 'Success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('mailModal'));
        if (modal) {
          modal.hide();
        }
      },
      error => {
        console.error('Error updating mail configuration:', error);
        this.toastr.error('Failed to update mail configuration', 'Error');
      }
    );
  }
  }
