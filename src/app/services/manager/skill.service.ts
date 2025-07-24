import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../Environment/environment';
 
@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private baseUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}
 
 
 
 
  addSkill(skillName: string): Observable<any> {
    const params = new HttpParams().set('skillName', skillName);
    return this.http.post(`${this.baseUrl}`, {}, { params });
  }
 
 
  updateSkill(oldSkillName: string, newSkillName: string): Observable<any> {
    const params = new HttpParams()
      .set('oldSkillName', oldSkillName)
      .set('newSkillName', newSkillName);
    return this.http.put(`${this.baseUrl}`, {}, { params });
  }
 
 
  deleteSkill(skillName: string): Observable<any> {
    const params = new HttpParams().set('skillName', skillName);
    return this.http.delete(`${this.baseUrl}`, { params });
  }
}