import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import FormsModule
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-project-list',
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  projectForm!: FormGroup;


 projects = [
    {
      projectCode: 'PRJ001',
      projectName: 'Apollo Dashboard',
      customerName: 'Acme Corp',
      currency: 'USD',
      scheduleStartDate: new Date('2025-06-01'),
      scheduleEndDate: new Date('2025-12-01'),
      projectManager: 'John Doe'
    },
    {
      projectCode: 'PRJ002',
      projectName: 'Orion Tracker',
      customerName: 'Beta Ltd',
      currency: 'INR',
      scheduleStartDate: new Date('2025-05-15'),
      scheduleEndDate: new Date('2025-10-15'),
      projectManager: 'Jane Smith'
    },
    {
      projectCode: 'PRJ001',
      projectName: 'Apollo Dashboard',
      customerName: 'Acme Corp',
      currency: 'USD',
      scheduleStartDate: new Date('2025-06-01'),
      scheduleEndDate: new Date('2025-12-01'),
      projectManager: 'John Doe'
    },
    {
      projectCode: 'PRJ002',
      projectName: 'Orion Tracker',
      customerName: 'Beta Ltd',
      currency: 'EUR',
      scheduleStartDate: new Date('2025-03-15'),
      scheduleEndDate: new Date('2025-09-30'),
      projectManager: 'Jane Smith'
    },
    {
      projectCode: 'PRJ003',
      projectName: 'Luna Analytics',
      customerName: 'Gamma Systems',
      currency: 'GBP',
      scheduleStartDate: new Date('2025-04-10'),
      scheduleEndDate: new Date('2025-10-20'),
      projectManager: 'Michael Johnson'
    },
    {
      projectCode: 'PRJ004',
      projectName: 'Solar CRM',
      customerName: 'Delta Solutions',
      currency: 'INR',
      scheduleStartDate: new Date('2025-02-01'),
      scheduleEndDate: new Date('2025-08-01'),
      projectManager: 'Emily Davis'
    },
    {
      projectCode: 'PRJ005',
      projectName: 'Neptune POS',
      customerName: 'Omega Retail',
      currency: 'USD',
      scheduleStartDate: new Date('2025-01-20'),
      scheduleEndDate: new Date('2025-06-30'),
      projectManager: 'Chris Evans'
    },
    {
      projectCode: 'PRJ006',
      projectName: 'Mercury ERP',
      customerName: 'Zenith Corp',
      currency: 'CAD',
      scheduleStartDate: new Date('2025-07-01'),
      scheduleEndDate: new Date('2025-11-30'),
      projectManager: 'Sophia Brown'
    },
    {
      projectCode: 'PRJ007',
      projectName: 'Venus HRM',
      customerName: 'HRNext',
      currency: 'AUD',
      scheduleStartDate: new Date('2025-05-05'),
      scheduleEndDate: new Date('2025-11-05'),
      projectManager: 'Liam Wilson'
    },
    {
      projectCode: 'PRJ008',
      projectName: 'Jupiter Inventory',
      customerName: 'Techwave',
      currency: 'USD',
      scheduleStartDate: new Date('2025-03-25'),
      scheduleEndDate: new Date('2025-09-25'),
      projectManager: 'Isabella Lee'
    },
    {
      projectCode: 'PRJ009',
      projectName: 'Saturn Finance',
      customerName: 'FinNext',
      currency: 'EUR',
      scheduleStartDate: new Date('2025-02-10'),
      scheduleEndDate: new Date('2025-07-20'),
      projectManager: 'Noah Clark'
    },
    {
      projectCode: 'PRJ010',
      projectName: 'Pluto Reports',
      customerName: 'Insight Co.',
      currency: 'SGD',
      scheduleStartDate: new Date('2025-06-15'),
      scheduleEndDate: new Date('2025-12-31'),
      projectManager: 'Olivia Hall'
    },
    {
      projectCode: 'PRJ011',
      projectName: 'Comet Planner',
      customerName: 'Orbit Group',
      currency: 'INR',
      scheduleStartDate: new Date('2025-01-05'),
      scheduleEndDate: new Date('2025-04-30'),
      projectManager: 'William Scott'
    }
  ];
  selectedProject: any = null;

  paginatedProjects: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  warnMailDate = '';
  warnMailTime = '';
  reminderMailDate = '';
  notSUbmittedMail = '';
  reminderMailTime = '';
  searchTerm: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.updatePagination();
  }

  updatePagination(): void {
    // Optionally add filtering here if you want search
    let filteredProjects = this.projects;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filteredProjects = this.projects.filter(proj =>
        proj.projectCode.toLowerCase().includes(term) ||
        proj.projectName.toLowerCase().includes(term) ||
        proj.customerName.toLowerCase().includes(term) ||
        proj.currency.toLowerCase().includes(term) ||
        proj.projectManager.toLowerCase().includes(term)
      );
    }
    this.totalPages = Math.ceil(filteredProjects.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProjects = filteredProjects.slice(start, end);
  }

  // Pagination controls
  goToFirstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.updatePagination();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToLastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // Search
  applySearch(): void {
    this.currentPage = 1;
    this.updatePagination();
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
  this.selectedProject = this.projects[i];
  const projectCode = this.selectedProject.projectCode;
  this.router.navigate(['/delivery-manager/edit-projects/', projectCode]);
}




configureEmailProject(proj: any) {
    this.openMailModal(proj);
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
    const modal = new bootstrap.Modal(document.getElementById('mailModal'));
    modal.show();
  }

  sendEmail(): void {
    console.log('Sending email for project:', this.selectedProject);
    console.log('Warn Mail:', this.warnMailDate, this.warnMailTime);
    console.log('Reminder Mail:', this.reminderMailDate, this.reminderMailTime);
    // Implement actual email sending logic here
  }

  gotoAddProject(){
    this.router.navigate(['/delivery-manager/add-projects']);
  }




}
