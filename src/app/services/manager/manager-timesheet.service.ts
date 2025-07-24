import { Injectable } from '@angular/core';
import { environment } from '../../../Environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TimesheetSummary } from '../../models/TimesheetSummary';
import { Observable } from 'rxjs';
import { TimeSheetFetchPayload } from '../../models/TimeSheetFetchPayload';
import { TimesheetApprovalPayload } from '../../models/TimesheetApprovalPayload';
 
@Injectable({
  providedIn: 'root'
})
export class ManagerTimesheetService {
 
  private baseUrl = `${environment.apiUrl}/timesheet`;
 
 
  constructor(private http: HttpClient) { }
 
 
  getAllTimesheetSummaryReviewForManager(startDate: string, endDate: string): Observable<TimesheetSummary[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<TimesheetSummary[]>(`${this.baseUrl}/summary`, { params });
  }
 
 
  getTimesheetForResourceAndProject(
  resourceId: string,
  projectCode: string,
  startDate: string | Date,   // Accept both
  endDate: string | Date      // Accept both
): Observable<TimeSheetFetchPayload> {
  const normalizedStart = this.normalizeDateForApi(startDate);
  const normalizedEnd = this.normalizeDateForApi(endDate);
 
  console.log('Normalized Dates Sent:', normalizedStart, normalizedEnd);
 
  const params = new HttpParams()
    .set('startDate', normalizedStart)
    .set('endDate', normalizedEnd);
 
  return this.http.get<TimeSheetFetchPayload>(
    `${this.baseUrl}/resource/${resourceId}/project/${projectCode}`,
    { params }
  );
}
 
private normalizeDateForApi(date: string | Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
}
 
 
 
 
  approveTimeSheetData(timesheetApprovalPayload: TimesheetApprovalPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval`, timesheetApprovalPayload, { responseType: 'text' as 'json' });
  }
}