import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerPayload } from '../../../models/CustomerPayload';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../../services/manager/resource.service';
import { ResourceAllocationService } from '../../../services/manager/resource-allocation.service';
import { ProjectAllocationViewPayload } from '../../../models/ProjectAllocationViewPayload';
import { ProjectResourceAllocationsPayload } from '../../../models/ProjectResourceAllocationsPayload';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExcelExportService } from '../../../services/shared/excel-export.service';

@Component({
  selector: 'app-view-allocations',
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './view-allocations.component.html',
  styleUrl: './view-allocations.component.scss'
})
export class ViewAllocationsComponent implements OnInit {

  // Component properties
projectPayload!: ProjectAllocationViewPayload;

resources: ProjectResourceAllocationsPayload[] = [];
filteredResources: ProjectResourceAllocationsPayload[] = [];

searchQuery = '';

totalElements = 0;
totalPages = 0;

currentPage = 1;
pageSize = 5;


  project: any = {
    id: null,
    name: '',
    code: '',
    customerName: ''
  };

  // Loading and error states
  isLoadingProject = true;
  isLoadingResources = true;
  projectError: string | null = null;
  resourcesError: string | null = null;

  // Pagination properties


  // Project code from route
  projectCode: string | null = null;

  // Destroy subject for cleanup


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ResourceAllocationService,
    private resourceService: ResourceService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    // Get project code from route parameters
    this.projectCode = this.route.snapshot.paramMap.get('projectCode');

    console.log('Project Code:', this.projectCode);
    if (this.projectCode) {
      this.isLoadingProject = false;
      this.loadProjectResources();
    } else {
      this.projectError = 'No project code provided';
      this.isLoadingProject = false;
    }
  }

  exportToExcel(): void {
    const data = this.filteredResources.map(res => ({
      Name: res.name,
      'Primary Skill': this.getPrimarySkills(res),
      'Secondary Skill': this.getSecondarySkills(res),
      Designation: res.designation,
      Experience: res.experience,
      'Billable %': res.billability,
      'Planned Utilization %': res.plannedUtil,
      'Actual Utilization %': res.actualUtil
    }));

    this.excelExportService.exportAsExcelWithNestedSheets(data, 'project_resources');
  }


  /**
   * Load project details by project code
   */
private loadProjectResources(): void {
  if (!this.projectCode) return;

  this.isLoadingResources = true;
  this.resourcesError = null;

  this.projectService
    .getAllResourceAllocationsForProject(this.currentPage - 1, this.pageSize, this.projectCode)
    .subscribe({
      next: (payload: ProjectAllocationViewPayload) => {
        this.projectPayload = payload;

        this.project.code = payload.projectCode;
        this.project.name = payload.projectName;
        this.project.customer = payload.customerName;

        this.resources = payload.resourceAllocations.content;
        this.totalElements = payload.resourceAllocations.totalElements;
        this.totalPages = payload.resourceAllocations.totalPages;

        this.applySearchFilter(); // frontend search
        this.isLoadingResources = false;
      },
      error: (error) => {
        this.resourcesError = 'Failed to load project resources';
        this.isLoadingResources = false;
        console.error('Error loading project resources:', error);
      }
    });
}

get pagedResources(): ProjectResourceAllocationsPayload[] {
  return this.filteredResources;
}

    getPrimarySkills(employee: ProjectResourceAllocationsPayload): string {
      return employee.primarySkill.map(skill => skill.skillName).join(', ');
    }

    getSecondarySkills(employee: ProjectResourceAllocationsPayload): string {
      return employee.secondarySkill.map(skill => skill.skillName).join(', ');
    }



applySearchFilter(): void {
  const query = this.searchQuery.toLowerCase();

  if (!query) {
    this.filteredResources = this.resources;
    return;
  }

  this.filteredResources = this.resources.filter(res =>
    res.name.toLowerCase().includes(query) ||
    res.empId?.toLowerCase().includes(query) ||
    res.designation?.toLowerCase().includes(query)
  );
}



  // Pagination getters and methods
  // get totalPages(): number {
  //   return Math.ceil(this.resources.length / this.pageSize) || 1;
  // }



  // Pagination navigation methods
 goToFirstPage(): void {
  this.currentPage = 1;
  this.loadProjectResources();
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadProjectResources();
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadProjectResources();
  }
}

goToLastPage(): void {
  this.currentPage = this.totalPages;
  this.loadProjectResources();
}

updatePagination(): void {
  this.currentPage = 1;
  this.loadProjectResources();
}

}
