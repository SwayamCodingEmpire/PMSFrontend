import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectPayload } from '../../models/ProjectPayload';
import { environment } from '../../../Environment/environment';
import { MailNotificationConfig } from '../../models/MailConfigPayload';
import { ProjectTypeDropdownGroup } from '../../models/ProjectTypePayloads';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/project`;


  constructor(private http: HttpClient) { }

  createProject(project: ProjectPayload): Observable<any> {
    console.log('ugtdshkjmlmddshkjk');
    console.log('Creating project with payload:', project);
    return this.http.post(this.baseUrl, project, { responseType: 'text' as 'json' });
  }

  updateProject(projectCode: string, project: ProjectPayload): Observable<any> {
    console.log('Updating project with code:', projectCode);
    console.log('With payload:', project);
    return this.http.put(`${this.baseUrl}/${projectCode}`, project, { responseType: 'text' as 'json' });
  }

  getProjectByCode(projectCode: string): Observable<ProjectPayload> {
    console.log('Fetching project with code:', projectCode);
    return this.http.get<ProjectPayload>(`${this.baseUrl}/${projectCode}`);
  }

  getMailConfigByProjectCode(projectCode: string): Observable<MailNotificationConfig> {
    console.log('Fetching mail configuration for project code:', projectCode);
    return this.http.get<MailNotificationConfig>(`${this.baseUrl}/${projectCode}/mail-config`);
  }

  configureMailNotification(projectCode: string, mailConfig: MailNotificationConfig): Observable<any> {
    console.log('Configuring mail notification for project code:', projectCode);
    console.log('With configuration:', mailConfig);
    return this.http.put(`${this.baseUrl}/${projectCode}/mail-config`, mailConfig, { responseType: 'text' as 'json' });
  }

  confilgureDefaultMailConfig(mailConfig: MailNotificationConfig): Observable<any> {
    console.log('Configuring default mail notification with:', mailConfig);
    return this.http.put(`${this.baseUrl}/default-mail-config`, mailConfig, { responseType: 'text' as 'json' });
  }

    getAllProjectTypes(): Observable<ProjectTypeDropdownGroup[]> {
    console.log('Fetching project types');
    return this.http.get<ProjectTypeDropdownGroup[]>(`${this.baseUrl}/types`);
  }


}
