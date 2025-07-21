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

  getAllResourceAllocations(page: number, size: number): Observable<PaginatedResourceAllocationPayload> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<PaginatedResourceAllocationPayload>(`${this.baseUrl}/all`, { params });
  }

  saveResourceAllocations(allocations: AllocationPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}`, allocations, { responseType: 'text' as 'json' });
  }


  searchAllResourceAllocations(page: number, size: number, resourceFlterPayload: ResourceFilterPayload): Observable<PaginatedResourceAllocationPayload> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.post<PaginatedResourceAllocationPayload>(`${this.baseUrl}/search`, resourceFlterPayload, { params });
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
