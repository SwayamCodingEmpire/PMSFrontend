import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceDashboardService {
private baseUrl = `${environment.apiUrl}/resource-dashboard`;

  constructor(private httpClient: HttpClient) { }




  getKPIData(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/kpi`);
  }


    getProjectData(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/projects`);
  }

  getResourceUtilizationData(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/utilization`);
  }



}
