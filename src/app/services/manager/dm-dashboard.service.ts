import { BenchResource, ProjectData, ProjectManager, ProjectMinimalData } from './../../components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Observable, of } from 'rxjs';
import { ResourceDetail, Skill } from '../../components/delivery-manager/dm-dashboard/dm-dashboard.component';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  // getKPIData(): Observable<KPIData> {
  //   const mockData: KPIData = {
  //     totalActiveResources: 24,
  //     totalActiveProjects: 8,
  //     upcomingDeadlines: 3,
  //     unallocatedResources: 5
  //   };
  //   return of(mockData);
  // }


getAllSkillCounts(search: string | null): Observable<Skill[]> {
  let params = new HttpParams();

  console.log('Search term:', search);
  if (search) {
    params = params.set('search', search);
  }

  return this.httpClient.get<Skill[]>(`${this.baseUrl}/skill-counts`, { params });
}


getSkillResourceDetails(skillName: string, level: string, search: string | null): Observable<ResourceDetail[]> {
  let params = new HttpParams()
    .set('skillName', skillName)
    .set('level', level)
    .set('search', search || '');

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



    fetchAndExportAll(): void {
    this.httpClient.get<any>(`${this.baseUrl}/export-all`).subscribe(data => {
      const workbook = XLSX.utils.book_new();



      // Skill Counts
      const skillCountsFlat = (data.skillCounts || []).map((skill: any) => ({
        name: skill.name,
        totalCount: skill.totalCount
      }));

      const skillCountsSheet = XLSX.utils.json_to_sheet(skillCountsFlat);

      XLSX.utils.book_append_sheet(workbook, skillCountsSheet, 'Skill Counts');

      // Resource Skill Mapping
      const resourceSkillDetailsSheet = XLSX.utils.json_to_sheet(data.skillResourceDetails || []);
      XLSX.utils.book_append_sheet(workbook, resourceSkillDetailsSheet, 'Resource Skills');

      // Project Details
      const projectDetailsSheet = XLSX.utils.json_to_sheet(data.projectDetails || []);
      XLSX.utils.book_append_sheet(workbook, projectDetailsSheet, 'Projects');


      // Combine all PM projects into one list with PM ID column


      const combinedPmProjects: any[] = [];

      for (const [pmEmpId, projects] of Object.entries(data.projectsByPm || {})) {
        (projects as any[]).forEach(project => {
          combinedPmProjects.push({
            projectManagerEmpId: pmEmpId,
            name: project.name,
           
          });
        });
      }

      const role = localStorage.getItem('role');
      if(role=='DELIVERY_MANAGER'){
      const combinedPmSheet = XLSX.utils.json_to_sheet(combinedPmProjects, {
        header: ["projectManagerEmpId",  "name"]
      });
      XLSX.utils.book_append_sheet(workbook, combinedPmSheet, 'Projects By PM');
    }

      // Export final file
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `Manager_Dashboard_Export_${new Date().toISOString()}.xlsx`);

    });
  }

  getBenchedResources(): Observable<BenchResource[]> {
    return this.httpClient.get<BenchResource[]>(`${this.baseUrl}/bench-resources`);
  }

  // Gets summary list (outer structure)
}
