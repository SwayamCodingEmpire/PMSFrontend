import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectTransferService } from '../../../services/shared/project-transfer.service';
import { ProjectBasicModel } from '../../../models/ProjectBasicModel';
import { ResourceAllocations } from '../../../models/ResourceAllocations';
import { ProjectAllocation } from '../../../models/ProjectAllocation';
import { ProjectAllocationDetails } from '../../../models/ProjectAllocationDetails';
import { ResourceAllocationService } from '../../../services/manager/resource-allocation.service';
import { AllocationPayload } from '../../../models/AllocationPayload';
import { PaginatedResourceAllocationPayload } from '../../../models/PaginatedResourceAllocationPayload';
import { MultiSelectModule } from 'primeng/multiselect';
import { PublicService } from '../../../services/public/public.service';

@Component({
  selector: 'app-add-resources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FlexLayoutModule, MultiSelectModule],
  templateUrl: './assign-resources.component.html',
  styleUrls: ['./assign-resources.component.scss']
})
export class AssignResourceAllocationComponent {

  mode: 'all' | 'search' = 'all';
  filterForm!: FormGroup;
  allocationForms: { [id: number]: FormGroup } = {};

  allocationFormArray!: FormArray;


  selectedResources: ResourceAllocations[] = [];
  showFilters = true;
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalItems = 0;

  project: ProjectBasicModel | null = {
    name: 'Project Alpha',
    code: 'CZ011',
    customer: 'PSA BDP'
  };
  designationSearchTerm = '';
  allDesignations = [
  { label: 'Developer', value: 'Developer' },
  { label: 'Senior Developer', value: 'Senior Developer' },
  { label: 'Lead Engineer', value: 'Lead Engineer' },
  { label: 'Architect', value: 'Architect' },
  { label: 'Project Manager', value: 'Project Manager' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'Business Analyst', value: 'Business Analyst' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
  { label: 'QA Engineer', value: 'QA ajhfhkhhg' }
];



designations: {label:string, value:string}[] = [];


loadDesignations() {
  this.publicService.getAllDesignations().subscribe(
    (designations: string[]) => {
      this.allDesignations = designations.map(d => ({ label: d, value: d }));
      this.designations = [...this.allDesignations]; // Initialize with all designations
      this.filterDesignations();
    },
    error => {
      console.error('Error loading designations:', error);
    }
  );
}

filterDesignations() {
  const term = this.designationSearchTerm.toLowerCase();
  this.designations = this.allDesignations.filter(d =>
    d.label.toLowerCase().includes(term)
  );
}

  ngOnInit() {
    this.loadDesignations();
    this.allocationFormArray = this.fb.array([]);

    this.initFilterForm();
    this.projectTransferService.project$.subscribe(data => {
      if (data) {
        this.project = data;
      } else {
        // If no in-memory value, try from localStorage
        this.project = this.projectTransferService.getProject();
      }
    });


    this.loadResourceAllocationsData();
  }

  loadResourceAllocationsData() {
    if (this.mode === 'search') {
      this.currentPage = 1; // Reset to first page if switching to search mode
      this.mode = 'all';
    }
      const page = this.currentPage - 1;
      this.resourceAllocationService.getAllResourceAllocations(page, this.pageSize).subscribe(
        (paginatedData: PaginatedResourceAllocationPayload) => {
          this.resources = paginatedData.content || [];
          this.totalPages = paginatedData.totalPages || 1;
          this.totalItems = paginatedData.totalElements || 0;

          // Initialize allocation forms for each resource

        }
      );
  }

    getPrimarySkills(employee: ResourceAllocations): string {
      return employee.primarySkill.map(skill => skill.skillName).join(', ');
    }

    getSecondarySkills(employee: ResourceAllocations): string {
      return employee.secondarySkill.map(skill => skill.skillName).join(', ');
    }


  constructor(
    public fb: FormBuilder,
    private projectTransferService: ProjectTransferService,
    private resourceAllocationService: ResourceAllocationService,
    private publicService: PublicService
  ) { }

  isAllocatedToProject(resource: any, projectName: string): boolean {
    return resource.currentAllocation?.some((a: any) => a.projectCode === this.project?.code);
  }


  search = {
    skill: '',
    designation: '',
    experience: ''
  };

  resources: ResourceAllocations[] = [];
  //   {
  //     id: 1,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Alpha',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       projectName: 'Project Aplha',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }, {
  //       project: 'Project Omega',
  //       from: '2024-08-01',
  //       to: '2024-10-15',
  //       role: 'Frontend Developer',
  //       billability: 50,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 3,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 4,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 5,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 6,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 7,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 8,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 9,
  //     name: 'Jane Doe',
  //     primarySkill: 'Angular',
  //     secondarySkill: 'React',
  //     designation: 'Sr. Developer',
  //     experience: 6,
  //     currentAllocation: [{
  //       project: 'Project Beta',
  //       from: '2024-07-01',
  //       to: '2024-09-30',
  //       role: 'Frontend Developer',
  //       billability: 70,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 70,
  //     plannedUtil: 80,
  //     actualUtil: 75
  //   },
  //   {
  //     id: 10,
  //     name: 'John Smith',
  //     primarySkill: 'Java',
  //     secondarySkill: 'Spring',
  //     designation: 'Backend Dev',
  //     experience: 4,
  //     currentAllocation: [{
  //       project: 'Project Omega',
  //       from: '2024-08-01',
  //       to: '2024-10-15',
  //       role: 'Frontend Developer',
  //       billability: 50,
  //       plannedUtil: 80,
  //       actualUtil: 75
  //     }],
  //     billability: 50,
  //     plannedUtil: 60,
  //     actualUtil: 55
  //   }
  // ];


  allocation: ProjectAllocationDetails = {
    projectCode: this.project?.code || '',
    projectName: this.project?.name || '',
    from: '',
    to: '',
    role: '',
    billability: 0,
    plannedUtil: 0,
    actualUtil: 0
  };

  // Returns true if the resource is in selectedResources
  isSelected(res: any): boolean {
    return this.selectedResources.some(r => r.id === res.id);
  }

  // Toggle resource selection
  // In your component class

  // When toggling resource selection:
  // toggleResource(res: any) {
  //   if (this.isSelected(res)) {
  //     this.selectedResources = this.selectedResources.filter(r => r.id !== res.id);
  //   } else {
  //     // Clone to avoid mutating original if needed
  //     const resourceClone = { ...res };
  //     // If allocation already exists (from previous selection), keep it; else create new
  //     if (!resourceClone.allocation) {
  //       resourceClone.allocation = {
  //         start: '',
  //         end: '',
  //         role: '',
  //         billability: null,
  //         plannedUtil: null
  //       };
  //     }
  //     this.selectedResources.push(resourceClone);
  //   }
  // }

  // allocateAllResources() {
  //   if (this.selectedResources.length === 0) {
  //     alert('Select at least one resource to allocate!');
  //     return;
  //   }
  //   // You can send this.selectedResources (with .allocation property) to backend here
  //   console.log('Allocating resources:', this.selectedResources.map(r => ({
  //     name: r.name,
  //     allocation: r.allocation
  //   })));
  //   alert(
  //     `Allocated ${this.selectedResources.length} resource(s):\n\n` +
  //     this.selectedResources.map(r =>
  //       `${r.name}: ${r.allocation.start} to ${r.allocation.end}, Role: ${r.allocation.role}, Billability: ${r.allocation.billability}, Planned: ${r.allocation.plannedUtil}`
  //     ).join('\n')
  //   );
  //   this.selectedResources = [];
  // }

  // Toggle all resources select/deselect
  allSelected(): boolean {
    return this.selectedResources.length === this.resources.length && this.resources.length > 0;
  }
  toggleAll(ev: any) {
    if (ev.target.checked) {
      this.selectedResources = [...this.resources];
    } else {
      this.selectedResources = [];
    }
  }

  // Allocation logic
  allocateResource() {
    if (this.selectedResources.length === 0) {
      alert('Select at least one resource to allocate!');
      return;
    }
    alert(
      `Allocated ${this.selectedResources.length} resource(s) to project ${this.project?.code} from ${this.allocation.from} to ${this.allocation.to}.`
    );
    this.selectedResources = [];
    this.resetAllocationForm();
  }

  resetAllocationForm() {
    if (!this.project) {
      return;
    }

    this.allocation = {
      projectCode: this.project.code,
      projectName: this.project.name,
      from: '',
      to: '',
      role: '',
      billability: 0,
      plannedUtil: 0,
      actualUtil: 0
    };
  }


  resetFilters() {
    this.search = { skill: '', designation: '', experience: '' };
  }



  // Pagination


  // For navigation
  // Pagination controls
  goToFirstPage(): void {

    if (this.currentPage > 1) {
      this.currentPage = 1;
      if (this.mode === 'search') {
        this.searchResources();
      }
      else {
        this.loadResourceAllocationsData();
      }

    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.mode === 'search') {
        this.searchResources();
      }
      else {
        this.loadResourceAllocationsData();
      }
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.mode === 'search') {
        this.searchResources();
      }
      else {
        this.loadResourceAllocationsData();
      }
    }
  }

  goToLastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      if (this.mode === 'search') {
        this.searchResources();
      }
      else {
        this.loadResourceAllocationsData();
      }
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    if (this.mode === 'search') {
      this.searchResources();
    }
    else {
      this.loadResourceAllocationsData();
    }
  }




  showDetailsModal = false;
  selectedAllocations: any[] = [];

  openDetailsModal(allocations: any[]) {
    this.selectedAllocations = allocations;
    setTimeout(() => {
      // Wait for Angular to update the DOM, then show modal
      const modal = new (window as any).bootstrap.Modal(document.getElementById('allocationDetailsModal'));
      modal.show();
    });
  }


  getFilterValue(controlName: string) {
    return this.filterForm.get(controlName)?.value;
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      skill: [''],
      designation: [[]],
      experience: ['']
    });
  }

  initAllocationForm(resourceId: number) {
    const existing = this.allocationForms[resourceId];
    if (!existing) {
      this.allocationForms[resourceId] = this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required],
        role: ['', Validators.required],
        billability: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        plannedUtil: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      });
    }
  }

  searchResources() {
    if (this.mode !== 'search') {
      this.currentPage = 1; // Reset to first page if switching to search mode
    }
    this.mode = 'search';
    const filters = {
      skill: this.getFilterValue('skill') || '',
      designation: this.getFilterValue('designation') || [],
      experience: this.getFilterValue('experience') || 0
    }
    console.log('Searching resources with filters:', filters);

    const page = this.currentPage - 1;
    this.resourceAllocationService.searchAllResourceAllocations(page, this.pageSize, filters).subscribe(
      (paginatedData: PaginatedResourceAllocationPayload) => {
        this.resources = paginatedData.content || [];
        this.totalPages = paginatedData.totalPages || 1;
        this.totalItems = paginatedData.totalElements || 0;

        // Initialize allocation forms for each resource

      }
    );
  }

  // toggleResource(res: any) {
  //   const index = this.selectedResources.findIndex(r => r.id === res.id);
  //   if (index > -1) {
  //     this.selectedResources.splice(index, 1);
  //     delete this.allocationForms[res.id];
  //   } else {
  //     this.selectedResources.push({ ...res });
  //     this.initAllocationForm(res.id);
  //   }
  // }

  // allocateAllResources() {
  //   if (!this.selectedResources.length) {
  //     alert('Select at least one resource to allocate!');
  //     return;
  //   }

  //   const allocations : AllocationPayload = {
  //     projectCode: this.project?.code || '',
  //     allocations: this.selectedResources.map(res => {
  //       const form = this.allocationForms[res.id];
  //       return {
  //         id: this.resources[res.id].id, // Assuming resources is an array of ResourceAllocations
  //         start: form.get('start')?.value,
  //         end: form.get('end')?.value,
  //         role: form.get('role')?.value,
  //         billability: form.get('billability')?.value,
  //         plannedHours: form.get('plannedUtil')?.value
  //       };
  //     }
  //   }

  //   console.log('Allocating resources:', allocations);

  //   this.selectedResources = [];
  //   this.allocationForms = {};
  // }

  addAllocationForm(resource: ResourceAllocations) {
    const form = this.fb.group({
      id: [resource.id], // Store resource ID
      start: ['', Validators.required],
      end: ['', Validators.required],
      role: ['', Validators.required],
      billability: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      plannedUtil: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.allocationFormArray.push(form);
  }

  toggleResource(resource: ResourceAllocations) {
    const index = this.selectedResources.findIndex(r => r.id === resource.id);
    if (index > -1) {
      this.selectedResources.splice(index, 1);

      // Remove form from FormArray
      const formIndex = this.allocationFormArray.controls.findIndex(
        ctrl => ctrl.get('id')?.value === resource.id
      );
      if (formIndex !== -1) {
        this.allocationFormArray.removeAt(formIndex);
      }
    } else {
      this.selectedResources.push(resource);
      this.addAllocationForm(resource);
    }
  }

  clearFilters(){
    this.loadResourceAllocationsData();
  }

  allocateAllResources() {
    if (this.allocationFormArray.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const allocations: AllocationPayload = {
      projectCode: this.project?.code || '',
      allocations: this.allocationFormArray.value.map((formValue: any) => ({
        id: formValue.id,
        start: formValue.start,
        end: formValue.end,
        role: formValue.role,
        billability: formValue.billability,
        plannedHours: formValue.plannedUtil
      }))
    };


    this.resourceAllocationService.saveResourceAllocations(allocations).subscribe(
      response => {
        console.log('Resource allocation successful:', response);
        this.loadResourceAllocationsData();
      }
    );


    this.selectedResources = [];
    this.allocationFormArray.clear();
  }



}
