import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../../models/LoginCredentials';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  private baseUrl = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) { }

getAllDesignations(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/designations`);
}

getAllSkills(): Observable<string[]> {
  return this.http.get<string[]>(`${this.baseUrl}/skills`);
}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'json' });
  }

    storeTokenAndRole(token: string, role: string, name:string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
  }
}
