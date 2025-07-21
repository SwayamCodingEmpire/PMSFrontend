import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { Observable } from 'rxjs';
import { ProjectManagerPayload } from '../../models/ProjectManagerPayload';
import { ReportingManagerPayload } from '../../models/ReportingManagerPayload';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

getProjectManagersWithProjects(): Observable<ProjectManagerPayload[]> {
  return this.http.get<ProjectManagerPayload[]>(`${this.baseUrl}/project-managers`);
}


getReportingManagers(): Observable<ReportingManagerPayload[]> {
  return this.http.get<ReportingManagerPayload[]>(`${this.baseUrl}/reporting-managers`);
}




}
