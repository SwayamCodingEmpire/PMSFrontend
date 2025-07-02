import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-resources',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FlexLayoutModule],
  templateUrl: './assign-resources.component.html',
  styleUrls: ['./assign-resources.component.scss']
})
export class AssignResourceAllocationComponent {

  selectedResources: any[] = [];
  showFilters = false;

  project = {
    name: 'Project Alpha',
    code: 'CZ011',
    customer: 'PSA BDP'
  };

  isAllocatedToProject(resource: any, projectName: string): boolean {
  return resource.currentAllocation?.some((a: any) => a.project === projectName);
}


  search = {
    primarySkill: '',
    secondarySkill: '',
    designation: '',
    experience: ''
  };

  resources = [
  {
    id: 1,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Alpha',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
          plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 2,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Aplha',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 3,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 4,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 5,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 6,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 7,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 8,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation: {
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 9,
    name: 'Jane Doe',
    primarySkill: 'Angular',
    secondarySkill: 'React',
    designation: 'Sr. Developer',
    experience: 6,
    currentAllocation:{
      project: 'Project Beta',
      from: '2024-07-01',
      to: '2024-09-30',
      billability: 70,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 70,
    plannedUtil: 80,
    actualUtil: 75
  },
  {
    id: 10,
    name: 'John Smith',
    primarySkill: 'Java',
    secondarySkill: 'Spring',
    designation: 'Backend Dev',
    experience: 4,
    currentAllocation: {
      project: 'Project Omega',
      from: '2024-08-01',
      to: '2024-10-15',
      billability: 50,
               plannedUtil: 80,
    actualUtil: 75
    },
    billability: 50,
    plannedUtil: 60,
    actualUtil: 55
  }
];


  allocation = {
    start: '',
    end: '',
    role: '',
    billability: null,
    plannedUtil: null
  };

  // Returns true if the resource is in selectedResources
  isSelected(res: any): boolean {
    return this.selectedResources.some(r => r.id === res.id);
  }

  // Toggle resource selection
  toggleResource(res: any) {
    if (this.isSelected(res)) {
      this.selectedResources = this.selectedResources.filter(r => r.id !== res.id);
    } else {
      this.selectedResources.push(res);
    }
  }

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
      `Allocated ${this.selectedResources.length} resource(s) to project ${this.project.name} from ${this.allocation.start} to ${this.allocation.end}.`
    );
    this.selectedResources = [];
    this.resetAllocationForm();
  }

  resetAllocationForm() {
    this.allocation = { start: '', end: '', role: '', billability: null, plannedUtil: null };
  }

  resetFilters() {
    this.search = { primarySkill: '', secondarySkill: '', designation: '', experience: '' };
  }

  // Simulated search, here you can add your real search/filter logic
  searchResources() {
    alert('Searching resources... (this is static demo data)');
    // Add real filtering here if needed.
  }

  // Pagination
  pageSize = 5;
  currentPage = 1;

  // For total resources
  get totalPages() {
    return Math.ceil(this.resources.length / this.pageSize) || 1;
  }

  get pagedResources() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.resources.slice(start, start + this.pageSize);
  }

  // For navigation
  goToFirstPage() { this.currentPage = 1; }
  goToPreviousPage() { if (this.currentPage > 1) this.currentPage--; }
  goToNextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToLastPage() { this.currentPage = this.totalPages; }
  updatePagination() { this.currentPage = 1; }



showDetailsModal = false;
selectedAllocations: any[] = [];

openDetailsModal(allocations: any[]) {
  this.selectedAllocations = allocations;
  this.showDetailsModal = true;
}


}
