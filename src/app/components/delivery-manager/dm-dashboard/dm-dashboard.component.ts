import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip
} from 'ng-apexcharts';
import { ChangeDetectorRef } from '@angular/core';
import { DmDashboardService } from '../../../services/manager/dm-dashboard.service';
import { ExcelExportService } from '../../../services/shared/excel-export.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare var bootstrap: any;
type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
};

type StackedBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  legend: ApexLegend;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
};

export interface ProjectManager {
  empId: string;
  name: string;
  projectCount: number;
  projects?: ProjectMinimalData[];
}

export interface ProjectMinimalData{
    code: string;
  name: string;
  customer: string;
  resources:number;
}

export interface ProjectData {
  code: string;
  name: string;
  customer: string;
  manager: string;
  billability: number;
  totalResources: number;
  plannedUtilization: number;
  actualUtilization: number;
}

export interface ProjectData {
  code: string;
  name: string;
  customer: string;
  manager: string;
  billability: number;
  totalResources: number;
  plannedUtilization: number;
  actualUtilization: number;
}

interface KPIData {
  totalResources: number;
  billedNotBilled: { billed: number; notBilled: number };
  customerPlannedUtilization: number;
  customerActualUtilization: number;
  nonCustomerPlannedUtilization: number;
  nonCustomerActualUtilization: number;
  nonUtilizedResources: number;
}

// New interfaces for skills
interface SkillLevel {
  level: string;
  count: number;
  resources: ResourceDetail[];
}

export interface Skill {
  name: string;
  totalCount: number;
  levels: { level: string; count: number }[]; // no resources initially
}

export interface ResourceDetail {
  name: string;
  employeeId: string;
  email: string;
  designation: string;
  experience: number;
  currentProject: string;
  utilization: number;
}

interface BenchResource {
  id: string;
  name: string;
  previousProject: string;
  daysOnBench: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './dm-dashboard.component.html',
  styleUrls: ['./dm-dashboard.component.scss']
})
export class DmDashboardComponent implements OnInit {

  // Make Math available in template
  Math = Math;

  // KPI Data
  kpiData: KPIData = {
    totalResources: 34,
    billedNotBilled: { billed: 23, notBilled: 11 },
    customerActualUtilization: 75,
    customerPlannedUtilization: 80,
    nonCustomerPlannedUtilization: 15,
    nonCustomerActualUtilization: 10,
    nonUtilizedResources: 5
  };

  // Bench Resources Data
  benchResources: BenchResource[] = [
    {
      id: 'EMP001',
      name: 'John Doe',
      previousProject: 'Project Alpha',
      daysOnBench: 5
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      previousProject: 'Project Beta',
      daysOnBench: 15
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      previousProject: 'Project Gamma',
      daysOnBench: 45
    },
    {
      id: 'EMP004',
      name: 'Sarah Wilson',
      previousProject: 'Project Delta',
      daysOnBench: 22
    },
    {
      id: 'EMP005',
      name: 'David Brown',
      previousProject: 'Project Epsilon',
      daysOnBench: 60
    }
  ];

 ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((el: HTMLElement) => {
      new bootstrap.Tooltip(el);
    });
  }


  // Projects data with new structure
  projects: ProjectData[] = [];


  // Project Managers data
  projectManagers: ProjectManager[] = [];

  // Skills data with levels and resources
  skills: Skill[] = [];


  // Chart configuration
  projectManagerChart: ChartOptions = {
    series: [],
    chart: {
      type: 'donut',
      height: 350,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          this.onManagerSelect(config.dataPointIndex);
        }
      }
    },
    labels: [],
    colors: ['#667eea', '#0cebeb', '#a8c0ff', '#b8c6db', '#ff6b6b', '#4ecdc4'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Projects',
              fontSize: '14px'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        return opts.w.config.series[opts.seriesIndex];
      }
    }
  };

  // Skills chart configuration
  skillsChart: StackedBarChartOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          this.onSkillSelect(config.dataPointIndex, config.seriesIndex);
        }
      }
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Resource Count',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    legend: {
      position: 'top',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val > 0 ? val : '';
      },
      style: {
        colors: ['#fff']
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: any) {
          return val + ' resources';
        }
      }
    }
  };

  // Table and pagination properties
  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  // Skills resource pagination properties
  skillResourceSearchTerm = '';
  skillResourceCurrentPage = 1;
  skillResourcePageSize = 5;

  // Skills chart pagination properties
  skillsChartCurrentPage = 1;
  skillsChartPageSize = 4; // Show 4 skills per page in chart

  // Selected manager and projects
  selectedManager: ProjectManager | null = null;
  selectedManagerProjects: ProjectMinimalData[] = [];

  // Selected skill and resources
  selectedSkill: Skill | null = null;
  selectedSkillLevel: string | null = null;
  selectedSkillResources: ResourceDetail[] = [];

  constructor(private cdr: ChangeDetectorRef, private dmDashboardService: DmDashboardService, private excelExportService: ExcelExportService) {}

  ngOnInit() {
    // this.initializeChart();
    // this.initializeSkillsChart();
    this.loadProjects();
    this.loadSkillSChartData(null);
    this.loadKPICardsData();
    this.loadProjectCountByManager();
  }

  loadProjectCountByManager(): void {
  this.dmDashboardService.getProjectCountByPM().subscribe({
    next: (managers: ProjectManager[]) => {
      this.projectManagers = managers;

      // Update the chart once data is received
      this.initializeChart();

      // Ensure the view reflects the latest data
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading project manager data:', err);
    }
  });
}

  exportProjectList(): void {
    const data = this.projects.map(res => ({
      Code: res.code,
      Name: res.name,
      Customer: res.customer,
      Manager: res.manager,
      'Total Resources': res.totalResources,
      'Planned Utilization': res.plannedUtilization,
      'Actual Utilization': res.actualUtilization
    }));

    this.excelExportService.exportAsExcelWithNestedSheets(data, 'project_resources');
  }

  skillsSearchTerm: string = '';

onSkillSearchChange() {
  // Example: filter skills or fetch data from backend

}


    exportUserSSkillList(): void {
    const data = this.selectedSkillResources.map(res => ({
      name: res.name,
      'Employee ID': res.employeeId,
      Email: res.email,
      Designation: res.designation,
      Experience: res.experience,
      Utilization: res.utilization

    }));

    this.excelExportService.exportAsExcelWithNestedSheets(data, 'Skill Lists');
  }


  loadKPICardsData() {
    this.dmDashboardService.getKPICardsData().subscribe(
      (kpiData: any) => {
        this.kpiData = kpiData;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading KPI cards:', error);
      }
    );
  }

  loadSkillSChartData(searchTerm: string | null): void {
      this.dmDashboardService.getAllSkillCounts(searchTerm).subscribe(
    (skillPayload: Skill[]) => {
      this.skills = skillPayload;
    this.initializeSkillsChart();
    },
    error => {
      console.error('Error loading designations:', error);
    }
  );
  }

  initializeChart() {
    // Map project manager data to chart
    this.projectManagerChart.series = this.projectManagers.map(pm => pm.projectCount);
    this.projectManagerChart.labels = this.projectManagers.map(pm => pm.name);
  }

initializeSkillsChart() {
  const paginatedSkills = this.paginatedSkills;
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const newXCategories = paginatedSkills.map(skill => skill.name);
  const newSeries = levels.map(level => ({
    name: level,
    data: paginatedSkills.map(skill => {
      const levelData = skill.levels.find(l => l.level === level);
      return levelData ? levelData.count : 0;
    })
  }));

  // Full reinitialization of skillsChart object
  this.skillsChart = {
    series: [...newSeries],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          this.onSkillSelect(config.dataPointIndex, config.seriesIndex);
        }
      }
    },
    xaxis: {
      categories: [...newXCategories],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Resource Count',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    legend: {
      position: 'top',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: any) => val > 0 ? val : '',
      style: {
        colors: ['#fff']
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: any) => `${val} resources`
      }
    }
  };

  this.cdr.detectChanges();
}


  // Chart interaction
onManagerSelect(dataPointIndex: number) {
  if (dataPointIndex >= 0 && dataPointIndex < this.projectManagers.length) {
    const manager = this.projectManagers[dataPointIndex];
    this.selectedManager = manager;

    // Call the service to get projects for this manager
    this.dmDashboardService.getProjectDetailsByPmId(manager.empId).subscribe({
      next: (projects: ProjectMinimalData[]) => {
        // Store projects under selected manager and for display
manager.projects = projects;
this.selectedManagerProjects = projects;


        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error fetching projects for manager ${manager.name}:`, err);
      }
    });
  }
}



  // Skills chart interaction - adjusted for pagination
onSkillSelect(dataPointIndex: number, seriesIndex: number) {
  const paginatedSkills = this.paginatedSkills;
  if (dataPointIndex >= 0 && dataPointIndex < paginatedSkills.length && seriesIndex >= 0) {
    const skill = paginatedSkills[dataPointIndex];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const level = levels[seriesIndex];

    this.selectedSkill = skill;
    this.selectedSkillLevel = level;

    // Reset pagination and search immediately
    this.skillResourceCurrentPage = 1;
    this.skillResourceSearchTerm = '';

    // Fetch resource details
    this.dmDashboardService.getSkillResourceDetails(skill.name, level, this.skillsSearchTerm).subscribe(
      (resourceDetails: ResourceDetail[]) => {
        this.selectedSkillResources = resourceDetails;
        this.skillResourceCurrentPage = 1;
this.skillResourceSearchTerm = ''; // Optional: reset search


        // ⚠️ Call detectChanges *after* the data is assigned
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading skill resources:', error);
      }
    );
  }
}



  // Skills chart pagination
  get paginatedSkills() {
    const start = (this.skillsChartCurrentPage - 1) * this.skillsChartPageSize;
    return this.skills.slice(start, start + this.skillsChartPageSize);
  }

  get skillsChartTotalPages() {
    return Math.ceil(this.skills.length / this.skillsChartPageSize);
  }

  // Table filtering and pagination
  get filteredProjects() {
    if (!this.searchTerm) return this.projects;
    return this.projects.filter(p =>
      p.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.manager.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedProjects() {
    const filtered = this.filteredProjects;
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredProjects.length / this.pageSize);
  }

  // Skills resource filtering and pagination
get filteredSkillResources(): ResourceDetail[] {
  if (!this.skillResourceSearchTerm) {
    return this.selectedSkillResources;
  }

  const search = this.skillResourceSearchTerm.toLowerCase();
  return this.selectedSkillResources.filter(resource =>
    resource.name.toLowerCase().includes(search) ||
    resource.employeeId.toLowerCase().includes(search) ||
    resource.designation.toLowerCase().includes(search)
  );
}


  get paginatedSkillResources() {
    const filtered = this.filteredSkillResources;
    const start = (this.skillResourceCurrentPage - 1) * this.skillResourcePageSize;
    return filtered.slice(start, start + this.skillResourcePageSize);
  }

  get skillResourceTotalPages() {
    return Math.ceil(this.filteredSkillResources.length / this.skillResourcePageSize);
  }

  // Pagination controls for projects
  goToFirstPage() { this.currentPage = 1; }
  goToPreviousPage() { if (this.currentPage > 1) this.currentPage--; }
  goToNextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToLastPage() { this.currentPage = this.totalPages; }

  // Pagination controls for skills resources
  goToFirstPageSkillResource() { this.skillResourceCurrentPage = 1;
    this.cdr.detectChanges();
   }
  goToPreviousPageSkillResource() { if (this.skillResourceCurrentPage > 1) this.skillResourceCurrentPage--;
    this.cdr.detectChanges();
  }
  goToNextPageSkillResource() {
  if (this.skillResourceCurrentPage < this.skillResourceTotalPages) {
    this.skillResourceCurrentPage++;
    this.cdr.detectChanges(); // <-- Force re-render
  }
}

  goToLastPageSkillResource() { this.skillResourceCurrentPage = this.skillResourceTotalPages;
    this.cdr.detectChanges();
   }

  // Pagination controls for skills chart
  goToFirstPageSkillsChart() {
    this.skillsChartCurrentPage = 1;
    this.clearSelectedSkill();
    this.initializeSkillsChart();
  }

  goToPreviousPageSkillsChart() {
    if (this.skillsChartCurrentPage > 1) {
      this.skillsChartCurrentPage--;
      this.clearSelectedSkill();
      this.initializeSkillsChart();
    }
  }

  goToNextPageSkillsChart() {
    if (this.skillsChartCurrentPage < this.skillsChartTotalPages) {
      this.skillsChartCurrentPage++;
      this.clearSelectedSkill();
      this.initializeSkillsChart();
    }
  }

  goToLastPageSkillsChart() {
    this.skillsChartCurrentPage = this.skillsChartTotalPages;
    this.clearSelectedSkill();
    this.initializeSkillsChart();
  }

  // Helper method to clear selected skill
  private clearSelectedSkill() {
    this.selectedSkill = null;
    this.selectedSkillLevel = null;
    this.selectedSkillResources = [];
    this.skillResourceCurrentPage = 1;
    this.skillResourceSearchTerm = '';
  }

  // Search functionality
  onSearchChange() {
    this.currentPage = 1;
  }

  // Skills resource search functionality
  onSkillResourceSearchChange() {
    this.skillResourceCurrentPage = 1;
  }

  // Utility method to get skill level badge class
  getSkillLevelBadgeClass(level: string): string {
    switch(level) {
      case 'Beginner': return 'bg-danger';
      case 'Intermediate': return 'bg-warning';
      case 'Advanced': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

     loadProjects(): void {
  this.dmDashboardService.getDashboardData().subscribe({
    next: (data: ProjectData[]) => {
      this.projects  = data;
      console.log('Projects loaded:', this.projects); // Should show array from API
    },
    error: (err) => {
      console.error('Error loading dashboard:', err);
    }
  });
}

  // Utility method to get utilization badge class
  getUtilizationBadgeClass(utilization: number): string {
    if (utilization >= 85) return 'bg-success';
    if (utilization >= 70) return 'bg-warning';
    if (utilization > 0) return 'bg-danger';
    return 'bg-secondary';
  }

triggerSkillSearch(): void {
  const term = this.skillsSearchTerm?.trim().toLowerCase();

  if (!term) {
    console.error('Skill search term is empty');
    return;
  }

  this.loadSkillSChartData1(term);
}

  loadSkillSChartData1(searchTerm: string | null): void {
      this.dmDashboardService.getAllSkillCounts(searchTerm).subscribe(
    (skillPayload: Skill[]) => {
      this.skills = skillPayload;
      console.log('Skills loaded:', this.skills); // Should show array from API
    this.initializeSkillsChart();
    },
    error => {
      console.error('Error loading designations:', error);
    }
  );
  }

    exportDashboard() {
  this.dmDashboardService.fetchAndExportAll();
}

exportProjectByManager():void{
  const data = this.selectedManagerProjects.map(res => ({
 
 
    Code: res.code,
    Name: res.name,
    Customer: res.customer,
    Resources: res.resources
  }));
  this.excelExportService.exportAsExcelWithNestedSheets(data, 'Projects By Manager');
}

  // Bench Resources Modal Methods
  openBenchResourcesModal(): void {
    const modalEl = document.getElementById('benchResourcesModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  getBenchStatusBadgeClass(daysOnBench: number): string {
    if (daysOnBench <= 7) {
      return 'bg-success'; // 1-7 days - green
    } else if (daysOnBench <= 30) {
      return 'bg-warning'; // 8-30 days - yellow
    } else {
      return 'bg-danger'; // 30+ days - red (high stress)
    }
  }

  getBenchRowClass(daysOnBench: number): string {
    if (daysOnBench <= 7) {
      return 'bench-row-success'; // 1-7 days - light green row
    } else if (daysOnBench <= 30) {
      return 'bench-row-warning'; // 8-30 days - light yellow row
    } else {
      return 'bench-row-danger'; // 30+ days - light red row (high stress)
    }
  }

}
