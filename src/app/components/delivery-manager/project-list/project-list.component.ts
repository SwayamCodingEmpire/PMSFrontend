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


  warnMailDate!: string;
  warnMailTime!: string;
  reminderMailDate!: string;
  reminderMailTime!: string;


  constructor(private router: Router) {}

  ngOnInit(): void {

    // Initialize the empty form
    this.projectForm = new FormGroup({
      projectCode: new FormControl(''),
      projectName: new FormControl(''),
      customerName: new FormControl(''),
      currency: new FormControl(''),
      scheduleStartDate: new FormControl(null),
      scheduleEndDate: new FormControl(null),
      projectManager: new FormControl(''),
      contractType: new FormControl(''),
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.projects.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProjects = this.projects.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  viewProjectDetails(proj: any) {
    this.selectedProject = proj;
    const modal = new bootstrap.Modal(document.getElementById('projectDetailsModal')!);
    modal.show();
  }

  // Component properties
// Add these properties to your ProjectListComponent class

// Step navigation
currentStep = 1;
isNewCustomer = false;

// Search properties
customerSearchText = '';
managerSearchText = '';

// Selection properties
selectedCustomerId: number | null = null;
selectedManagerId: number | null = null;

// Data arrays (you may already have these or need to fetch from service)
customers: any[] = [
  { id: 1, name: 'Acme Corp', legalEntity: 'Acme LLC', contractType: 'Fixed Price' },
  { id: 2, name: 'Tech Solutions', legalEntity: 'Tech Solutions Inc', contractType: 'Time & Material' },
  { id: 3, name: 'Global Enterprises', legalEntity: 'Global Enterprises Ltd', contractType: 'Cost Plus' }
];

managers: any[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    projects: ['Project Alpha', 'Project Beta']
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    projects: ['Project Gamma']
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    projects: ['Project Delta', 'Project Epsilon', 'Project Zeta']
  }
];

// Computed properties (getters)
get filteredCustomers() {
  if (!this.customerSearchText) {
    return this.customers;
  }
  return this.customers.filter(customer =>
    customer.name.toLowerCase().includes(this.customerSearchText.toLowerCase()) ||
    customer.legalEntity.toLowerCase().includes(this.customerSearchText.toLowerCase())
  );
}

get filteredManagers() {
  if (!this.managerSearchText) {
    return this.managers;
  }
  return this.managers.filter(manager =>
    manager.name.toLowerCase().includes(this.managerSearchText.toLowerCase()) ||
    manager.email.toLowerCase().includes(this.managerSearchText.toLowerCase())
  );
}

// Navigation methods
nextStep(): void {
  if (this.currentStep < 3) {
    this.currentStep++;
  }
}

previousStep(): void {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}

// Selection methods
setCustomerType(isNew: boolean): void {
  this.isNewCustomer = isNew;
  if (isNew) {
    this.selectedCustomerId = null;
  }
}

selectCustomer(customer: any): void {
  this.selectedCustomerId = customer.id;
  // Optionally populate form with customer data
  this.projectForm.get('customerInfo')?.patchValue({
    name: customer.name,
    legalEntity: customer.legalEntity,
    contractType: customer.contractType
  });
}

selectManager(managerId: number): void {
  this.selectedManagerId = managerId;
  const selectedManager = this.managers.find(m => m.id === managerId);
  if (selectedManager) {
    this.projectForm.patchValue({
      projectManager: selectedManager.name
    });
  }
}

// Update your existing editProject method
editProject(i: number): void {
  this.selectedProject = this.projects[i];
  this.projectForm.patchValue(this.selectedProject);

  // Reset modal state
  this.currentStep = 1;
  this.isNewCustomer = false;
  this.customerSearchText = '';
  this.managerSearchText = '';
  this.selectedCustomerId = null;
  this.selectedManagerId = null;

  // If editing existing project, pre-select customer and manager
  if (this.selectedProject.customerId) {
    this.selectedCustomerId = this.selectedProject.customerId;
  }
  if (this.selectedProject.managerId) {
    this.selectedManagerId = this.selectedProject.managerId;
  }
}

// Update your form structure to include customerInfo
updateProjectForm(): void {
  this.projectForm = new FormGroup({
    projectCode: new FormControl(''),
    projectName: new FormControl(''),
    currency: new FormControl(''),
    scheduleStartDate: new FormControl(null),
    scheduleEndDate: new FormControl(null),
    projectManager: new FormControl(''),
          contractType: new FormControl(''),
    customerInfo: new FormGroup({
      name: new FormControl(''),
      legalEntity: new FormControl(''),
      businessUnit: new FormControl('')
    })
  });
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

  sendEmail() {
    console.log('Sending email for project:', this.selectedProject);
    console.log('Warn Mail:', this.warnMailDate, this.warnMailTime);
    console.log('Reminder Mail:', this.reminderMailDate, this.reminderMailTime);
    // Implement actual email sending logic here
  }




}
