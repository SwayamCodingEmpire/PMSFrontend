import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerPayload } from '../../../models/CustomerPayload';
import { ProjectManagerPayload } from '../../../models/ProjectManagerPayload';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-projects',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './add-projects.component.html',
  styleUrl: './add-projects.component.scss'
})
export class AddProjectsComponent {
  mode!: 'add' | 'edit';
  projectCode!: string;
  selectedCustomerId: number | null = null;
  managers: ProjectManagerPayload[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', projects: ['Alpha', 'Beta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', projects: ['Delta'] },
  ];
  searchText: string = '';

 ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
    console.log('Mode:', this.mode);

    if (this.mode === 'add') {
      // Add mode logic
    } else if (this.mode === 'edit') {
          this.route.paramMap.subscribe(params => {
      const code = params.get('projectCode');

      if (code) {
        this.projectCode = code;
        console.log('Editing project:', this.projectCode);

        // Fetch project details from backend using projectCode
        // e.g., this.projectService.getByCode(this.projectCode)
      } else {
        console.error('Project code not found in route!');
      }
    });
    }
  }

  get visibleCustomers() {
    if (!this.searchText) {
      return this.customers;
    }
    const search = this.searchText.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.legalEntity?.toLowerCase().includes(search) ||
      c.contractType?.toLowerCase().includes(search)
    );
  }





  currentStep = 0;
  isNewCustomer = false;

  steps = [
    { label: 'Project Info' },
    { label: 'Customer' },
    { label: 'Project Manager' }
  ];

  customers: CustomerPayload[] = [
    { id: 1, name: 'ABC Corp', legalEntity: 'ABC Ltd', businessUnit: 'IT', contractType: 'Fixed', billingFrequency: 'Monthly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' },
    { id: 2, name: 'XYZ Inc', legalEntity: 'XYZ Pvt', businessUnit: 'Consulting', contractType: 'Time & Material', billingFrequency: 'Quarterly' }
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
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
      customerInfo: this.fb.group({
        existingCustomerId: [''],
        name: ['', Validators.required],
        legalEntity: ['', Validators.required],
        businessUnit: [''],

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
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/delivery-manager/project-list']);
      console.log("Form Submitted", this.form.value);

    } else {
      console.log("Form Invalid");
    }
  }


  get filteredCustomers() {
    const search = this.searchText.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.legalEntity?.toLowerCase().includes(search) ||
      c.contractType?.toLowerCase().includes(search)
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
  selectManager(managerId: number) {
    this.form.get('managerId')?.setValue(managerId);
  }



}
