import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgApexchartsModule, ChartType, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexTooltip } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { Pipe, PipeTransform } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
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
  activeProjects = [
    { code: 'CZ011', name: 'Project 1', customer: 'PSA BDP', currency: 'US Dollar', startDate: '01-02-2024', endDate: '01-02-2026', manager: 'Arbind' },
    { code: 'CZ022', name: 'Project 2', customer: 'EWL', currency: 'UK Pound', startDate: '01-03-2024', endDate: '01-12-2026', manager: 'Milland' },
    { code: 'CZ033', name: 'Project 3', customer: 'DFDS', currency: 'Euro', startDate: '01-10-2024', endDate: '01-12-2026', manager: 'Shanker' },
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
  chartOptions = {
    series: [
      { name: "Planned Utilization", data: [65, 70, 75, 80, 85, 90, 95] },
      { name: "Actual Utilization", data: [60, 65, 72, 78, 88, 92, 94] },
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
    colors: ["#008FFB", "#0cebeb"]
  };
 
  // ------ Dummy methods for button actions ------
  resetTable() { this.projectSearchTerm = ''; }
  editProject(project: any) { alert('Edit Project: ' + project.code); }
  viewProject(project: any) { alert('View Project: ' + project.code); }
}