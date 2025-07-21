import { Injectable } from '@angular/core';
import { TimeSheetFetchPayload } from '../../models/TimeSheetFetchPayload';
import { environment } from '../../../Environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SingularTimesheetPayload } from '../../models/SingularTimesheetPayload';

@Injectable({
  providedIn: 'root'
})
export class ResourceTimesheetService {
  private baseUrl = `${environment.apiUrl}/timesheet`;

  constructor(private http: HttpClient) { }

  getTimeSheetData(startDate: string, endDate: string): Observable<TimeSheetFetchPayload[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TimeSheetFetchPayload[]>(`${this.baseUrl}`, { params });
  }

  saveTimeSheetData(singularTImesheetPayload: SingularTimesheetPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}`, singularTImesheetPayload, { responseType: 'text' as 'json' });
  }

  submitTimeSheetData(timeSheetPayload: TimeSheetFetchPayload[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, timeSheetPayload, { responseType: 'text' as 'json' });
  }

}
