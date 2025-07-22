import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectTypeDTO } from '../../models/ProjectTypeDTO';
 // adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {
  private baseUrl = 'http://localhost:8080/project-type';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all project types from the backend.
   */
  getAll(): Observable<ProjectTypeDTO[]> {
    return this.http.get<ProjectTypeDTO[]>(this.baseUrl);
  }

  /**
   * Create a new project type (no ID needed).
   */
  create(project: Omit<ProjectTypeDTO, 'id'>): Observable<ProjectTypeDTO> {
    return this.http.post<ProjectTypeDTO>(this.baseUrl, project);
  }

  /**
   * Update an existing project type by ID.
   */
  update(project: ProjectTypeDTO): Observable<ProjectTypeDTO> {
    return this.http.put<ProjectTypeDTO>(`${this.baseUrl}/${project.id}`, project);
  }
}
