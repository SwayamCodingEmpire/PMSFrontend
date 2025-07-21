import { ProjectData, ProjectManager, ProjectMinimalData } from './../../components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResourceDetail, Skill } from '../../components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../Environment/environment';

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


@Injectable({
  providedIn: 'root'
})
export class DmDashboardService {
  private baseUrl = `${environment.apiUrl}/manager-dashboard`;

  constructor(private httpClient: HttpClient) { }

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


  getAllSkillCounts(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(`${this.baseUrl}/skill-counts`);
  }

getSkillResourceDetails(skillName: string, level: string): Observable<ResourceDetail[]> {
  const params = { skillName, level };
  return this.httpClient.get<ResourceDetail[]>(`${this.baseUrl}/skill-resource-details`, { params });
}

getKPICardsData(): Observable<KPIData> {
  return this.httpClient.get<KPIData>(`${this.baseUrl}/kpi`);
}


  getDashboardData(): Observable<ProjectData[]> {
    return this.httpClient.get<ProjectData[]>(`${this.baseUrl}/projects`);
  }

  getProjectCountByPM(): Observable<ProjectManager[]> {
    return this.httpClient.get<ProjectManager[]>(`${this.baseUrl}/project-count`);
  }

  getProjectDetailsByPmId(pmId: string): Observable<ProjectMinimalData[]> {
    return this.httpClient.get<ProjectMinimalData[]>(`${this.baseUrl}/projects-by-pm/${pmId}`);
  }

  // Gets summary list (outer structure)
}
