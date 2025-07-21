import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;
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
import { ProjectData, ResourceDetail, Skill } from '../../delivery-manager/dm-dashboard/dm-dashboard.component';
import { PmDashboardService } from '../../../services/manager/pm-dashboard.service';

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
export interface ProjectResourceSummary {
  code: string;
  name: string;
  customer: string;
  resourceCount: number;
  resources?: ProjectResourceDetail[]; // populated on demand
  empId: string; // the manager who owns this project
}

export interface ProjectResourceDetail {
  code: string;        // employee ID
  name: string;
  role: string;
  utilization: number;
}




// interface ProjectData {
//   code: string;
//   name: string;
//   customer: string;
//   manager: string;
//   billability: number;
//   totalResources: number;
//   plannedUtilization: number;
//   actualUtilization: number;
// }

interface KPIData {
  totalResources: number;
  billedNotBilled: { billed: number; notBilled: number };
  customerPlannedUtilization: number;
  customerActualUtilization: number;
  nonCustomerPlannedUtilization: number;
  nonCustomerActualUtilization: number;
  nonUtilizedResources: number;
}

// interface ResourceDetail {
//   id: number;
//   name: string;
//   employeeId: string;
//   email: string;
//   designation: string;
//   experience: number;
//   primarySkill: string;
//   utilization: number;
//   role: string;
// }

// export interface SkillLevel {
//   level: string;
//   count: number;
//   resources: ResourceDetail[];
// }

// export interface Skill {
//   name: string;
//   totalCount: number;
//   levels: { level: string; count: number }[]; // no resources initially
// }

interface TopPerformer {
  resourceName: string;
  primarySkill: string;
  allocationPercentage: number;
  timesheetCompliance: number;
  feedbackRating?: number;
}

@Component({
  selector: 'app-pm-dashboard',
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  standalone: true,
  templateUrl: './pm-dashboard.component.html',
  styleUrl: './pm-dashboard.component.scss'
})
export class PmDashboardComponent implements OnInit {
  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((el: HTMLElement) => {
      new bootstrap.Tooltip(el);
    });
  }

  projectResourceDetail: ProjectResourceDetail[] = [];


  // Make Math available in template
  Math = Math;
  projectResourceSummaries: ProjectResourceSummary[] = [];
selectedProjectSummary: ProjectResourceSummary | null = null;


loadResourceCountPerProject(): void {
  this.pmDashboardService.getProjectResourceSummary().subscribe({
    next: (data: ProjectResourceSummary[]) => {
      this.projectResourceSummaries = data;

      this.projectChart.series = data.map(p => p.resourceCount);
      this.projectChart.labels = data.map(p => p.code);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading project summaries:', err);
    }
  });
}

onProjectSelect(dataPointIndex: number) {
  if (dataPointIndex >= 0 && dataPointIndex < this.projectResourceSummaries.length) {
    const selected = this.projectResourceSummaries[dataPointIndex];

    if (!selected.resources) {
      this.pmDashboardService.getProjectResourcesByProject(selected.code).subscribe({
        next: (resources: ProjectResourceDetail[]) => {
          selected.resources = resources; // Update the original object
          this.selectedProjectSummary = selected;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Error loading resources for project ${selected.code}`, err);
        }
      });
    } else {
      this.selectedProjectSummary = selected; // Set directly if resources already exist
      this.cdr.detectChanges();
    }
  }
}



  // KPI Data
  kpiData: KPIData = {
    totalResources: 24,
    billedNotBilled: {
      billed: 18,
      notBilled: 6
    },
    customerPlannedUtilization: 85,
    customerActualUtilization: 78,
    nonCustomerPlannedUtilization: 60,
    nonCustomerActualUtilization: 50,
    nonUtilizedResources: 3
  };


  // Projects data with resources
  projects: ProjectData[] = [];


  // Skills data with levels and resources
  skills: Skill[] = [];

  // Chart configuration for Projects (instead of managers)
  projectChart: ChartOptions = {
    series: [],
    chart: {
      type: 'donut',
      height: 350,
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          this.onProjectSelect(config.dataPointIndex);
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
              label: 'Total Resources',
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
      height: 400,
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
        colors: ['#fff'] // same dark color you're seeing in <tspan>
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

  // Selected project and resources
  selectedProject: ProjectData | null = null;
  selectedProjectResources: ResourceDetail[] = [];

  // Selected skill and resources
  selectedSkill: Skill | null = null;
  selectedSkillLevel: string | null = null;
  selectedSkillResources: ResourceDetail[] = [];



  constructor(private cdr: ChangeDetectorRef, private dmDashboardService: DmDashboardService, private pmDashboardService: PmDashboardService) { }

  ngOnInit() {
    this.loadResourceCountPerProject();
        this.initializeProjectChart();
    this.initializeSkillsChart();
    this.loadProjects();
    this.loadSkillSChartData();

    this.loadKPICardsData();
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



  loadSkillSChartData() {
    this.dmDashboardService.getAllSkillCounts().subscribe(
      (skillPayload: Skill[]) => {
        this.skills = skillPayload;
        // this.initializeChart();
        this.initializeSkillsChart();
      },
      error => {
        console.error('Error loading designations:', error);
      }
    );
  }

  //     initializeChart() {
  //   // Map project manager data to chart
  //   this.projectManagerChart.series = this.projectManagers.map(pm => pm.projectCount);
  //   this.projectManagerChart.labels = this.projectManagers.map(pm => pm.name);
  // }

  initializeSkillsChart() {
  const paginatedSkills = this.paginatedSkills;
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const newXCategories = paginatedSkills.map(skill => skill.name);
  console.log('New X Categories:', newXCategories);
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
      fontFamily: 'Inter, sans-serif',
      colors: '#495057' // <-- ADD THIS LINE
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

  initializeProjectChart() {
    // Map project data to chart (show resource count per project)
    this.projectChart.series = this.projects.map(p => p.totalResources);
    this.projectChart.labels = this.projects.map(p => p.code);
  }



  // Skills chart interaction - adjusted for pagination
  // Skills chart interaction - adjusted for pagination
  onSkillSelect(dataPointIndex: number, seriesIndex: number) {
    const paginatedSkills = this.paginatedSkills;
    if (dataPointIndex >= 0 && dataPointIndex < paginatedSkills.length && seriesIndex >= 0) {
      const skill = paginatedSkills[dataPointIndex];
      const levels = ['Beginner', 'Intermediate', 'Advanced'];
      const level = levels[seriesIndex];

      this.selectedSkill = skill;
      this.selectedSkillLevel = level;

      this.skillResourceCurrentPage = 1;
      this.skillResourceSearchTerm = '';

      this.dmDashboardService.getSkillResourceDetails(skill.name, level).subscribe(
        (resourceDetails: ResourceDetail[]) => {
          this.selectedSkillResources = resourceDetails;
          this.skillResourceCurrentPage = 1;
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
  get filteredSkillResources() {
    if (!this.skillResourceSearchTerm) return this.selectedSkillResources;
    return this.selectedSkillResources.filter(r =>
      r.name.toLowerCase().includes(this.skillResourceSearchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(this.skillResourceSearchTerm.toLowerCase()) ||
      r.designation.toLowerCase().includes(this.skillResourceSearchTerm.toLowerCase())
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
    switch (level) {
      case 'Beginner': return 'bg-danger';
      case 'Intermediate': return 'bg-warning';
      case 'Advanced': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  // Utility method to get utilization badge class
  getUtilizationBadgeClass(utilization: number): string {
    if (utilization >= 85) return 'bg-success';
    if (utilization >= 70) return 'bg-warning';
    if (utilization > 0) return 'bg-danger';
    return 'bg-secondary';
  }

}
