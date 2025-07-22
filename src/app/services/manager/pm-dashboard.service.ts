import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectResourceDetail, ProjectResourceSummary } from '../../components/project-manager/pm-dashboard/pm-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class PmDashboardService {

  private baseUrl = `${environment.apiUrl}/pm-dashboard`;

  constructor(private httpClient: HttpClient) { }


  getProjectResourceSummary(): Observable<ProjectResourceSummary[]>{
  return this.httpClient.get<ProjectResourceSummary[]>(`${this.baseUrl}/projects`);
}

// Gets inner resource details on click (by empId)
getProjectResourcesByProject(projectCode: string): Observable<ProjectResourceDetail[]>{
  console.log('Fetching resources for project code:', projectCode);
  return this.httpClient.get<ProjectResourceDetail[]>(`${this.baseUrl}/project-resource/${projectCode}`);
}
}
