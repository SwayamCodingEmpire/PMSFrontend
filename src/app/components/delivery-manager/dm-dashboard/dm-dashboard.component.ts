import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexPlotOptions,
  ApexDataLabels,
  ApexXAxis
} from 'ng-apexcharts';
 
type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
};
 
type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: string[];
  dataLabels?: ApexDataLabels;
  legend?: ApexLegend;
};
 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './dm-dashboard.component.html',
  styleUrls: ['./dm-dashboard.component.scss']
})
export class DmDashboardComponent implements OnInit {
  activeResourceDisplay = '0';
  memberDisplay = '0';
  projectDisplay = '0';
  showModal = false;
  selectedProject: any = null;
  searchTerm = '';
  totalActiveResources = 34;
  totalMembers = 58;
  totalActiveProjects = 12;
  availableManagers = 5;
 
  projects = [
    { code: 'CZ011', name: 'Project 1', customer: 'PSA BDP', manager: 'Arbind', status: 'On Track', start: '01-02-2024', end: '01-02-2026' },
    { code: 'CZ022', name: 'Project 2', customer: 'EWL', manager: 'Milland', status: 'At Risk', start: '01-03-2024', end: '01-12-2026' },
    { code: 'CZ033', name: 'Project 3', customer: 'DFDS', manager: 'Shanker', status: 'Critical', start: '01-10-2024', end: '01-12-2026' },
  ];
 
  keyProjectsChart: ChartOptions = {
    series: [6, 3, 2, 1],
    chart: {
      type: 'donut',
      height: 280,
      animations: { enabled: true, speed: 800 }
    },
    labels: ['Arbind', 'Milland', 'Shanker', 'Priya'],
    colors: ['#667eea', '#0cebeb', '#a8c0ff', '#b8c6db'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
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
      enabled: false
    }
  };
 
  projectStatusChart: ChartOptions = {
    series: [8, 2, 2],
    chart: {
      type: 'radialBar',
      height: 280,
      animations: { enabled: true, speed: 800 }
    },
    labels: ['On Track', 'At Risk', 'Critical'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '16px', fontWeight: 600 },
          total: {
            show: true,
            label: 'Total',
            formatter: () => '12'
          }
        }
      }
    }
  };
 
  usersActiveChart: ChartOptions = {
    series: [40, 18],
    chart: {
      type: 'radialBar',
      height: 280,
      animations: { enabled: true, speed: 800 }
    },
    labels: ['Active', 'Inactive'],
    colors: ['#3b82f6', '#e2e8f0'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { margin: 0, size: '70%' },
        dataLabels: {
          name: { offsetY: -10, fontSize: '14px' },
          value: { fontSize: '24px', fontWeight: 600, offsetY: 0 }
        }
      }
    }
  };
 
  // New full-width bar chart below project table
  projectsByMonthChart: BarChartOptions = {
    series: [{
      name: 'Projects',
      data: [3, 4, 6, 7, 5, 8, 4, 5, 3, 6, 4, 2]
    }],
    chart: {
      type: 'bar',
      height: 320,
      animations: { enabled: true, speed: 800 }
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    },
    colors: ['#667eea'],
    dataLabels: { enabled: false },
    legend: { show: false }
  };
 
  ngOnInit() {
    this.animateCount('activeResourceDisplay', this.totalActiveResources, 750);
    this.animateCount('memberDisplay', this.totalMembers, 950);
    this.animateCount('projectDisplay', this.totalActiveProjects, 1250);
  }
 
  animateCount(property: 'activeResourceDisplay' | 'memberDisplay' | 'projectDisplay', target: number, duration: number) {
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        this[property] = target.toString();
        clearInterval(interval);
      } else {
        this[property] = current.toString();
      }
    }, 16);
  }
 
  filteredProjects() {
    if (!this.searchTerm) return this.projects;
    return this.projects.filter(p =>
      p.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.manager.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
 
  viewProject(project: any) {
    this.selectedProject = project;
    this.showModal = true;
  }
 
  closeModal() {
    this.showModal = false;
    this.selectedProject = null;
  }
}