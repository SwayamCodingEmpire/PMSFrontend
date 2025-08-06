import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgApexchartsModule, ChartType, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexTooltip } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { Pipe, PipeTransform } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { ProjectDetailsPayload } from '../../../models/ProjectDetailsPayload ';
import { ResourceDashboardService } from '../../../services/resources/resource-dashboard.service';
@Pipe({ name: 'projectFilter', standalone: true })
export class ProjectFilterPipe implements PipeTransform {
  transform(projects: any[], searchTerm: string): any[] {
    if (!searchTerm) return projects;
    return projects.filter(project =>
      Object.values(project).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }
}

// ----------- COMPONENT -----------
@Component({
  selector: 'app-resource-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    NgApexchartsModule,
    ProjectFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './resource-dashboard.component.html',
  styleUrls: ['./resource-dashboard.component.scss']
})
export class ResourceDashboardComponent {

  constructor(private resourceDashboardService: ResourceDashboardService) { }

  private async loadApexCharts() {
    const ApexCharts = (await import('apexcharts')).default;
    return ApexCharts;
  }
  private dir = inject(Directionality);
  private doc = inject(DOCUMENT);
  private rtl = this.dir.value === 'rtl';
  private body = this.doc.body;
  private isRtl = signal(false);

  thisWeekHours = 40;
  currentProjectCount = 3;
  pageSize = 10;
currentPage = 1;

  // For search
  projectSearchTerm = '';

  // For table (add customer/currency/date/manager etc.)
activeProjects: ProjectDetailsPayload[] = [
  {
    projectCode: 'CZ011',
    projectName: 'Project 1',
    customerName: 'PSA BDP',
    currency: 'US Dollar',
    scheduleStartDate: new Date('2024-02-01'),
    scheduleEndDate: new Date('2026-02-01'),
    projectManager: 'Arbind',
    projectType: 'Client' // <-- Replace with actual type if known
  },
  {
    projectCode: 'CZ022',
    projectName: 'Project 2',
    customerName: 'EWL',
    currency: 'UK Pound',
    scheduleStartDate: new Date('2024-03-01'),
    scheduleEndDate: new Date('2026-12-01'),
    projectManager: 'Milland',
    projectType: 'Client'
  },
  {
    projectCode: 'CZ033',
    projectName: 'Project 3',
    customerName: 'DFDS',
    currency: 'Euro',
    scheduleStartDate: new Date('2024-10-01'),
    scheduleEndDate: new Date('2026-12-01'),
    projectManager: 'Shanker',
    projectType: 'Client'
  }
];


  // Submission Pie
  submissionPie = {
    series: [15, 5, 3],
    chart: { type: 'pie' as ChartType, height: 350 },
    labels: ['Submitted', 'Not Submitted', 'About to Assign'],
    colors: ['#667eea', '#0cebeb', '#b8c6db'],
    responsive: [{ breakpoint: 600, options: { chart: { height: 280 } } }]
  };
  // submissionPieDetails = [
  //   { label: 'Submitted', count: 14, color: '#4caf50' },
  //   { label: 'Not Submitted', count: 5, color: '#f44336' },
  //   { label: 'About to Assign', count: 3, color: '#ffc107' },
  // ];

  // Chart for Resource Utilization

  ngOnInit() {
    this.resourceDashboardService.getKPIData().subscribe(data => {
      this.thisWeekHours = data.totalHours;
      this.currentProjectCount = data.projectCount;
    });

    this.resourceDashboardService.getProjectData().subscribe(data => {
      this.activeProjects = data;
    });

    this.resourceDashboardService.getResourceUtilizationData().subscribe(data => {
      this.chartOptions.series = [
        { name: "Planned Utilization", data: data.map(d => d.plannedUtilization) },
        { name: "Actual Utilization", data: data.map(d => d.actualUtilization) }
      ];
    });
  }
  chartOptions = {
    series: [
      { name: "Planned Utilization", data: [65, 70, 75, 80, 85] },
      { name: "Actual Utilization", data: [60, 65, 72, 78, 88] },
    ],
    chart: {
      height: 350,
      type: 'area' as ChartType,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as "smooth", width: 3 },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    colors: ["#008FFB", "#0cebeb"]
  };

  // ------ Dummy methods for button actions ------
  resetTable() { this.projectSearchTerm = ''; }
  editProject(project: any) { alert('Edit Project: ' + project.code); }
  viewProject(project: any) { alert('View Project: ' + project.code); }
}
