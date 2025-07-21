import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectManagerPayload } from '../../models/ProjectManagerPayload';
import { ProjectDetailsPayload } from '../../models/ProjectDetailsPayload ';
import { PaginatedProjectsResponse } from '../../models/PaginatedProjectPayload';

@Injectable({
  providedIn: 'root'
})
export class ManagerProjectsService {
    private baseUrl = `${environment.apiUrl}/manager`;


  constructor(private http: HttpClient) { }


getAllProjectsForManager(page: number, size: number, searchTerm?: string): Observable<PaginatedProjectsResponse> {
  let params = new HttpParams()
    .set('page', page)
    .set('size', size);

  if (searchTerm && searchTerm.trim() !== '') {
    params = params.set('search', searchTerm.trim());
  }

  return this.http.get<PaginatedProjectsResponse>(`${this.baseUrl}/projects`, { params });
}

}
