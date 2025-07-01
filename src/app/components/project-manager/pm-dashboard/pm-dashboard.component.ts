import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartData, DmDashboardService, KPIData, ProjectData, TopPerformer } from '../../../services/manager/dm-dashboard.service';
 
@Component({
  selector: 'app-pm-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  standalone: true,
  templateUrl: './pm-dashboard.component.html',
  styleUrl: './pm-dashboard.component.scss'
})
export class PmDashboardComponent implements OnInit {
 
  // Dashboard data properties
  kpiData: KPIData = {
    totalActiveResources: 0,
    totalActiveProjects: 0,
    upcomingDeadlines: 0,
    unallocatedResources: 0
  };
 
  projectsList: ProjectData[] = [];
  topPerformers: TopPerformer[] = [];
  selectedTimeRange: string = '30'; // Default to 30 days
  isLoading: boolean = true;
 
  // Chart configurations
  projectStatusChart: any = {};
  resourceAllocationChart: any = {};
  projectPhaseChart: any = {};
  projectTimelineChart: any = {};
 
  constructor(private dashboardService: DmDashboardService) {}
 
  ngOnInit(): void {
    this.loadDashboardData();
  }
 
  // Load all dashboard data from service
 
  loadDashboardData(): void {
    this.isLoading = true;
   
    // Load KPI data
    this.dashboardService.getKPIData().subscribe({
      next: (data) => {
        this.kpiData = data;
      },
      error: (error) => {
        console.error('Error loading KPI data:', error);
      }
    });
 
    // Load projects list
    this.dashboardService.getProjectsList().subscribe({
      next: (data) => {
        this.projectsList = data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
 
    // Load top performers
    this.dashboardService.getTopPerformers().subscribe({
      next: (data) => {
        this.topPerformers = data;
      },
      error: (error) => {
        console.error('Error loading top performers:', error);
      }
    });
 
    // Load and configure charts
    this.dashboardService.getChartData().subscribe({
      next: (data) => {
        this.configureCharts(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.isLoading = false;
      }
    });
  }
 
  // Configure all chart options with data
  configureCharts(chartData: ChartData): void {
    // Project Status Pie Chart
    this.projectStatusChart = {
      series: chartData.projectStatusChart.map(item => item.value),
      chart: {
        type: 'pie',
        height: 350
      },
      labels: chartData.projectStatusChart.map(item => item.name),
      colors: ['#667eea', '#0cebeb', '#b8c6db'],
      legend: {
        position: 'bottom'
      },
      title: {
        text: 'Project Status Distribution',
        align: 'center'
      }
    };
 
    // Resource Allocation Donut Chart
    this.resourceAllocationChart = {
      series: chartData.resourceAllocationChart.map(item => item.value),
      chart: {
        type: 'donut',
        height: 350
      },
      labels: chartData.resourceAllocationChart.map(item => item.name),
      colors: ['#667eea', '#0cebeb', '#b8c6db'],
      legend: {
        position: 'bottom'
      },
      title: {
        text: 'Resource Allocation Status',
        align: 'center'
      }
    };
 
   
 
   
  }
 
  // Get status badge class based on project status
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'badge bg-success';
      case 'ongoing':
        return 'badge bg-primary';
      case 'future':
        return 'badge bg-info';
      case 'at-risk':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
 
  // Get progress bar class based on completion percentage
  getProgressBarClass(percentage: number): string {
    if (percentage >= 80) return 'progress-bar bg-success';
    if (percentage >= 50) return 'progress-bar bg-info';
    if (percentage >= 25) return 'progress-bar bg-warning';
    return 'progress-bar bg-danger';
  }
 
  // Handle time range filter change
  onTimeRangeChange(event: Event): void {
    this.selectedTimeRange = (event.target as HTMLSelectElement).value;
    // Reload data based on selected time range
    this.loadDashboardData();
  }
 
  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
 
  // Get star rating display for feedback
  getStarRating(rating?: number): string {
    if (!rating) return '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars;
  }
}


