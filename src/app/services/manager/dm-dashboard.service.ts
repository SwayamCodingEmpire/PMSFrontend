import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Resource {
  name: string;
  role: string;
  billability: number;
  allocationStartDate: string;
  allocationEndDate: string;
}
 
export interface ChartData {
  projectStatusChart: any[];
  resourceAllocationChart: any[];
  projectPhaseChart: any[];
  projectTimelineData: any[];
}
 
export interface KPIData {
  totalActiveResources: number;
  totalActiveProjects: number;
  upcomingDeadlines: number;
  unallocatedResources: number;
}

export interface Project {
  id: number;
  projectCode: string;
  projectName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  resources: Resource[];
}

export interface TopPerformer {
  resourceName: string;
  primarySkill: string;
  allocationPercentage: number;
  timesheetCompliance: number;
  feedbackRating?: number;
}
 
export interface ProjectData {
  projectCode: string;
  projectName: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'completed' | 'future' | 'at-risk';
  completionPercentage: number;
  utilization: number;
}

@Injectable({
  providedIn: 'root'
})
export class DmDashboardService {
 
  constructor() { }
 
  // Get KPI summary data for dashboard cards
  getKPIData(): Observable<KPIData> {
    const mockData: KPIData = {
      totalActiveResources: 24,
      totalActiveProjects: 8,
      upcomingDeadlines: 3,
      unallocatedResources: 5
    };
    return of(mockData);
  }
 
  // Get project list with status and progress
  getProjectsList(): Observable<ProjectData[]> {
    const mockProjects: ProjectData[] = [
      {
        projectCode: 'CZ011',
        projectName: 'Digital Transformation',
        client: 'PSA BDP',
        startDate: '2024-01-02',
        endDate: '2024-06-30',
        status: 'ongoing',
        completionPercentage: 75,
        utilization: 85
      },
      {
        projectCode: 'CZ022',
        projectName: 'Cloud Migration',
        client: 'EWL',
        startDate: '2024-02-15',
        endDate: '2024-08-15',
        status: 'ongoing',
        completionPercentage: 45,
        utilization: 92
      },
      {
        projectCode: 'CZ033',
        projectName: 'API Integration',
        client: 'DFDS',
        startDate: '2024-03-01',
        endDate: '2024-07-30',
        status: 'at-risk',
        completionPercentage: 30,
        utilization: 68
      },
      {
        projectCode: 'CZ044',
        projectName: 'Mobile App Development',
        client: 'TechCorp',
        startDate: '2024-01-15',
        endDate: '2024-05-15',
        status: 'completed',
        completionPercentage: 100,
        utilization: 95
      }
    ];
    return of(mockProjects);
  }
 
  // Get chart data for dashboard visualizations
  getChartData(): Observable<ChartData> {
    const mockChartData: ChartData = {
      projectStatusChart: [
        { name: 'Ongoing', value: 5 },
        { name: 'Completed', value: 3 },
        { name: 'Future', value: 2 }
      ],
      resourceAllocationChart: [
        { name: 'Single Project', value: 12 },
        { name: 'Multiple Projects', value: 7 },
        { name: 'Unallocated', value: 5 }
      ],
      projectPhaseChart: [
        { name: 'Initiation', value: 2 },
        { name: 'Planning', value: 3 },
        { name: 'Execution', value: 4 },
        { name: 'Closure', value: 1 }
      ],
      projectTimelineData: [
        { project: 'CZ011', completed: 75, inProgress: 15, remaining: 10 },
        { project: 'CZ022', completed: 45, inProgress: 25, remaining: 30 },
        { project: 'CZ033', completed: 30, inProgress: 20, remaining: 50 },
        { project: 'CZ044', completed: 100, inProgress: 0, remaining: 0 }
      ]
    };
    return of(mockChartData);
  }
 
    // Get top performing resources data
  getTopPerformers(): Observable<TopPerformer[]> {
    const mockPerformers: TopPerformer[] = [
      {
        resourceName: 'John Smith',
        primarySkill: 'Angular Developer',
        allocationPercentage: 95,
        timesheetCompliance: 100,
        feedbackRating: 4.8
      },
      {
        resourceName: 'Sarah Johnson',
        primarySkill: 'Java Developer',
        allocationPercentage: 90,
        timesheetCompliance: 98,
        feedbackRating: 4.6
      },
      {
        resourceName: 'Mike Davis',
        primarySkill: 'DevOps Engineer',
        allocationPercentage: 88,
        timesheetCompliance: 95,
        feedbackRating: 4.5
      },
      {
        resourceName: 'Lisa Anderson',
        primarySkill: 'UI/UX Designer',
        allocationPercentage: 85,
        timesheetCompliance: 100,
        feedbackRating: 4.7
      },
      {
        resourceName: 'Robert Wilson',
        primarySkill: 'Python Developer',
        allocationPercentage: 82,
        timesheetCompliance: 92,
        feedbackRating: 4.4
      }
    ];
    return of(mockPerformers);
  }
}