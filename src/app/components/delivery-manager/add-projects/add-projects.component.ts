import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerPayload } from '../../../models/CustomerPayload';
import { ProjectManagerPayload } from '../../../models/ProjectManagerPayload';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectPayload } from '../../../models/ProjectPayload';
import { ProjectService } from '../../../services/manager/project.service';
import { UsersService } from '../../../services/manager/users.service';
import { ClientsService } from '../../../services/manager/clients.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyService } from '../../../services/external-apis/currency.service';
import { CurrencyOptionPayload } from '../../../models/CurrencyOptionPayload';
import { StepperModule } from 'primeng/stepper';  // PrimeNG stepper module:contentReference[oaicite:0]{index=0}
import { ProjectTypeDropdownGroup } from '../../../models/ProjectTypePayloads';
declare const bootstrap: any;

@Component({
  selector: 'app-add-projects',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule, StepperModule],
  templateUrl: './add-projects.component.html',
  styleUrl: './add-projects.component.scss'
})
export class AddProjectsComponent {
   @ViewChild('formContainer', { static: true }) formContainer!: ElementRef;
  mode!: 'add' | 'edit';
  projectCode!: string;
  selectedCustomerId: number | null = null;
  managers: ProjectManagerPayload[] = [];
  customers: CustomerPayload[] = [];
  projectData: ProjectPayload | null = null;
  currencyOptions: CurrencyOptionPayload[] = [];
  projectTypeGroups : ProjectTypeDropdownGroup[] = [];
//   {
//     label: 'Infrastructure Projects',
//     options: [
//       { value: 'Data Center Migration', label: 'Data Center Migration' },
//       { value: 'Cloud Infrastructure Setup', label: 'Cloud Infrastructure Setup' },
//       { value: 'Network Redesign', label: 'Network Architecture Redesign' },
//       { value: 'Disaster Recovery', label: 'Disaster Recovery & Backup' },
//     ]
//   },
//   {
//     label: 'Software Development Projects',
//     options: [
//       { value: 'Web App Development', label: 'Web/Mobile App Development' },
//       { value: 'Internal Tooling', label: 'Internal Tool Development (HRMS, CRM)' },
//       { value: 'API Architecture', label: 'API & Microservices' },
//       { value: 'SaaS Development', label: 'SaaS Product Development' },
//     ]
//   },
//   {
//     label: 'Maintenance and Support',
//     options: [
//       { value: 'App Maintenance', label: 'Application Maintenance' },
//       { value: 'IT Service Desk', label: 'IT Service Desk' },
//       { value: 'Patch Management', label: 'Patch/Update Management' },
//       { value: 'Bug Fixing', label: 'Bug Fixes & Enhancements' },
//     ]
//   },
//   {
//     label: 'Migration and Upgrade',
//     options: [
//       { value: 'DB Migration', label: 'Database Migrations' },
//       { value: 'Platform Upgrade', label: 'Platform Upgrade (e.g., Win10 → Win11)' },
//       { value: 'ERP Transition', label: 'ERP Transition (SAP ECC → S/4HANA)' },
//       { value: 'Code Modernization', label: 'Codebase Modernization' },
//     ]
//   },
//   {
//     label: 'Business Process Automation',
//     options: [
//       { value: 'RPA', label: 'Robotic Process Automation (RPA)' },
//       { value: 'Workflow Automation', label: 'Workflow Automation (Power Automate, UiPath)' },
//       { value: 'Doc Automation', label: 'Document Processing Automation' },
//     ]
//   },
//   {
//     label: 'Digital Transformation',
//     options: [
//       { value: 'Customer Engagement', label: 'Omnichannel Engagement' },
//       { value: 'AI Integration', label: 'AI & Analytics Integration' },
//       { value: 'Legacy Modernization', label: 'Legacy Modernization' },
//       { value: 'Agile Transformation', label: 'Agile Transformation' },
//     ]
//   },
//   {
//     label: 'Cybersecurity Projects',
//     options: [
//       { value: 'IAM', label: 'Identity & Access Management (IAM)' },
//       { value: 'Vulnerability Testing', label: 'Vulnerability & Pen Testing' },
//       { value: 'SIEM Setup', label: 'SIEM Implementation' },
//       { value: 'Compliance Audits', label: 'Compliance Audits (GDPR, ISO, etc.)' },
//     ]
//   },
//   {
//     label: 'Enterprise Applications',
//     options: [
//       { value: 'ERP Implementation', label: 'ERP Implementation (SAP, Oracle)' },
//       { value: 'CRM Setup', label: 'CRM (Salesforce, HubSpot)' },
//       { value: 'HR Platform', label: 'HR Platforms (Workday)' },
//     ]
//   },
//   {
//     label: 'Research and Innovation',
//     options: [
//       { value: 'AI/ML Research', label: 'AI/ML Prototyping' },
//       { value: 'Blockchain', label: 'Blockchain Studies' },
//       { value: 'Quantum Computing', label: 'Quantum Research' },
//       { value: 'AR/VR', label: 'AR/VR Pilots' },
//     ]
//   },
//   {
//     label: 'Client-Facing / Delivery',
//     options: [
//       { value: 'Client App Dev', label: 'Client-specific App Development' },
//       { value: 'Managed Services', label: 'IT Managed Services' },
//       { value: 'SLA Support', label: 'SLA-Driven Support' },
//     ]
//   }
// ];

loadProjectTypes(){
  this.projectService.getAllProjectTypes().subscribe({
    next: (projectTypes: ProjectTypeDropdownGroup[]) => {
      this.projectTypeGroups = projectTypes;
      console.log('Project types loaded:', this.projectTypeGroups);
    },
    error: (error) => {
      console.error('Error loading project types:', error);
    }
  });
}

  // managers: ProjectManagerPayload[] = [
  //   { id: '1', name: 'John Doe', email: 'john@example.com', projects: ['Alpha', 'Beta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  // ];
  searchText: string = '';

  loadManagers() {
    this.usersService.getProjectManagersWithProjects().subscribe({
      next: (managers: ProjectManagerPayload[]) => {
        this.managers = managers;
        console.log('Managers loaded:', this.managers);
      },
      error: (error) => {
        console.error('Error loading managers:', error);
      }
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients: CustomerPayload[]) => {
        this.customers = clients;
        console.log('Clients loaded:', this.customers);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadProjectsForEdit(){
    this.projectService.getProjectByCode(this.projectCode).subscribe({
      next: (project: ProjectPayload) => {
        this.projectData = project;
        console.log('Project data loaded for edit:', this.projectData);
        this.form.patchValue({
          projectInfo: {
            code: project.projectInfo.code,
            name: project.projectInfo.name,
            description: project.projectInfo.description,
            startDate: project.projectInfo.startDate,
            endDate: project.projectInfo.endDate,
            currency: project.projectInfo.currency,
            contractType: project.projectInfo.contractType,
            billingFrequency: project.projectInfo.billingFrequency,
          },

          projectType: {
            projectType: project.projectType.projectType,
            customerProject: project.projectType.customerProject
          },
          customerInfo: {
            id: project.customerInfo.id,
            name: project.customerInfo.name,
            legalEntity: project.customerInfo.legalEntity,
            businessUnit: project.customerInfo.businessUnit
          },
          managerId: project.managerId
        });
        this.selectedCustomerId = project.customerInfo.id;
      },
      error: (error) => {
        console.error('Error loading project for edit:', error);
      }
    });
  }

 ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
    console.log('Mode:', this.mode);
    this.loadManagers();
    this.loadClients();
    this.loadCurrencyOptions();
    this.loadProjectTypes();

    if (this.mode === 'add') {
      // Add mode logic
    } else if (this.mode === 'edit') {
          this.route.paramMap.subscribe(params => {
      const code = params.get('projectCode');

      if (code) {
        this.projectCode = code;
        console.log('Editing project:', this.projectCode);
        this.loadProjectsForEdit();
      } else {
        console.error('Project code not found in route!');
      }
    });
    }
  }

    ngAfterViewInit(): void {
    const tooltipTriggerList = this.formContainer.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el: HTMLElement) => {
      new bootstrap.Tooltip(el);
    });
  }

  get visibleCustomers() {
    if (!this.searchText) {
      return this.customers;
    }
    const search = this.searchText.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.legalEntity?.toLowerCase().includes(search)
    );
  }





  currentStep = 0;
  isNewCustomer = false;

  steps = [
    { label: 'Project Info' },
    { label: 'Project Type' },
    { label: 'Customer' },
    { label: 'Project Manager' }
  ];

  // customers: CustomerPayload[] = [
  //   { id: 1, name: 'ABC Corp', legalEntity: 'ABC Ltd', businessUnit: 'IT',   },
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting'},
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting' },
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting'},
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting' },
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting'},
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting' },
  //   { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting'}
  // ];

  form: FormGroup;

  get customerProject() {
  return this.form.get('projectType.customerProject');
}


  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private usersService: UsersService,
    private clientService: ClientsService,
    private toastr: ToastrService,
    private currencyService: CurrencyService
  ) {
    this.form = this.fb.group({
  projectInfo: this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    currency: ['', Validators.required],
    contractType: ['', Validators.required],
    billingFrequency: ['Monthly'],
  }),
  projectType: this.fb.group({
    projectType: ['', Validators.required],
    customerProject: [false]
  }),
  customerInfo: this.fb.group({
    id: [1, Validators.required], // Default to first customer
    name: ['name', Validators.required],
    legalEntity: ['legalEntity', Validators.required],
    businessUnit: ['businessUnit', Validators.required],
  }),
  managerId: ['', Validators.required]
});

  }

  setCustomerType(isNew: boolean) {
    this.isNewCustomer = isNew;
    if (!isNew) {
      this.form.get('customerInfo')?.reset(); // clear new customer fields
    }
  }

  selectCustomer(customer: any) {
    this.selectedCustomerId = customer.id;
    this.form.get('customerInfo')?.patchValue(customer);
  }

nextStep() {
  const current = this.currentStep;

  // If moving from Step 1 and customerProject is FALSE, skip Customer Info step
  if (current === 1 && !this.form.get('projectType.customerProject')?.value) {
    this.currentStep = 3;
  } else {
    this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
  }
}

get skipCustomerStep(): boolean {
  return !this.form.get('projectType.customerProject')?.value;
}


prevStep() {
  const current = this.currentStep;

  // If currently on Step 3 and customerProject is FALSE, go back to Step 1
  if (current === 3 && !this.form.get('projectType.customerProject')?.value) {
    this.currentStep = 1;
  } else {
    this.currentStep = Math.max(this.currentStep - 1, 0);
  }
}


onSubmit(): void {
  if (this.form.valid) {
    const formData: ProjectPayload = this.form.value;
    console.log('Form Submitted:', formData);

    if(this.mode === 'add') {
    this.projectService.createProject(formData).subscribe({
      next: (response) => {
        console.log('Project created successfully:', response);
        this.toastr.success('Project created successfully!', 'Success');
        this.router.navigate(['/delivery-manager/project-list']);
        // Optionally, navigate to another page or show a success message

      },

      error: (error) => {
        this.toastr.error('Error creating project. Please try again.', 'Error');
        console.error('Error creating project:', error);
        // Handle error, show a message to the user, etc.
      }

    });
  }

  else{
    this.projectService.updateProject(this.projectCode, formData).subscribe({
      next: (response) => {
        console.log('Project updated successfully:', response);
        this.toastr.success('Project updated successfully!', 'Success');
        this.router.navigate(['/delivery-manager/project-list']);
      },
      error: (error) => {
        this.toastr.error('Error updating project. Please try again.', 'Error');
        console.error('Error updating project:', error);
      }
    });
  }


  } else {
    this.form.markAllAsTouched();
    this.toastr.error('Please fill all required fields correctly.', 'Form Invalid');
    console.log('Form Invalid');
  }
}



  get filteredCustomers() {
    const search = this.searchText.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.legalEntity?.toLowerCase().includes(search)
    );
  }

  managerSearchText: string = '';

  get filteredManagers() {
    const search = this.managerSearchText.toLowerCase();
    return this.managers.filter(m =>
      m.name.toLowerCase().includes(search) ||
      m.email.toLowerCase().includes(search) ||
      m.projects.some(p => p.toLowerCase().includes(search))
    );
  }
  selectManager(managerId: string) {
    this.form.get('managerId')?.setValue(managerId);
  }

  loadCurrencyOptions() {
    this.currencyService.getCurrencyOptions().subscribe({
      next: (currencies) => {

        this.currencyOptions = currencies;
      },
      error: (error) => {
        console.error('Error loading currency options:', error);
      }
    });
  }



}
