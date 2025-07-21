import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/Employee';
import { PaginatedResourcesPayload } from '../../models/PaginatedResources';
import { ResourceEditPayload } from '../../models/ResourceEditPayload';
export interface SkillUpsertDTO {
  experience: number;
  skillLevel: string;
  skillPriority: 'PRIMARY' | 'SECONDARY';
}


@Injectable({
  providedIn: 'root'
})
export class ResourceService {
    private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }


getAllResources(page: number, size: number, searchTerm?: string): Observable<PaginatedResourcesPayload> {
  let params = new HttpParams()
    .set('page', page)
    .set('size', size);

  if (searchTerm && searchTerm.trim() !== '') {
    params = params.set('search', searchTerm.trim());
  }

  return this.http.get<PaginatedResourcesPayload>(`${this.baseUrl}/resources`, { params });
}

  createResource(project: Employee): Observable<any> {
    return this.http.post(`${this.baseUrl}/resource`, project, { responseType: 'text' as 'json' });
  }

  updateResource(updatedResource: ResourceEditPayload): Observable<any> {
    console.log('Updating resource with ID:', updatedResource);
    return this.http.put(`${this.baseUrl}/resource`, updatedResource, { responseType: 'text' as 'json' });
  }


  updateSkillForResource(empId: string, skill: SkillUpsertDTO, skillName: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/resource/${empId}/skills/${skillName}`, skill, { responseType: 'text' as 'json' });
  }

    addSkillForResource(empId: string, skill: SkillUpsertDTO, skillName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resource/${empId}/skills/${skillName}`, skill, { responseType: 'text' as 'json' });
  }

  deleteSkillForResource(empId: string, skillName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/resource/${empId}/skills/${skillName}`, { responseType: 'text' as 'json' });
  }


}
