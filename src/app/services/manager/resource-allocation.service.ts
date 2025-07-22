import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environment/environment';
import { ResourceAllocations } from '../../models/ResourceAllocations';
import { AllocationPayload } from '../../models/AllocationPayload';
import { PaginatedResourceAllocationPayload } from '../../models/PaginatedResourceAllocationPayload';
import { ResourceFilterPayload } from '../../models/ResourceFilterPayload';
import { ProjectAllocationViewPayload } from '../../models/ProjectAllocationViewPayload';

@Injectable({
  providedIn: 'root'
})
export class ResourceAllocationService {

  private baseUrl = `${environment.apiUrl}/resource-allocation`;

  constructor(private http: HttpClient) { }

  getAllResourceAllocations(): Observable<ResourceAllocations[]> {
    return this.http.get<ResourceAllocations[]>(`${this.baseUrl}/all`);
  }

  saveResourceAllocations(allocations: AllocationPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}`, allocations, { responseType: 'text' as 'json' });
  }


 searchAllResourceAllocations(resourceFlterPayload: ResourceFilterPayload): Observable<ResourceAllocations[]>  {
    return this.http.post<ResourceAllocations[]>(`${this.baseUrl}/search`, resourceFlterPayload);
  }

  getAllResourceAllocationsForProject(page: number, size: number, projectCode: string): Observable<ProjectAllocationViewPayload> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<ProjectAllocationViewPayload>(`${this.baseUrl}/project/${projectCode}/allocations`, { params });
  }

  deleteAllocation(projectCode:string, empId: string): Observable<any> {
    console.log(`Deleting allocation for empId: ${empId} in project: ${projectCode}`);
    return this.http.delete(`${this.baseUrl}/project/${projectCode}/resource/${empId}`, { responseType: 'text' as 'json' });
  }

}
