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
    startDate: string,
    endDate: string
  ): Observable<TimeSheetFetchPayload> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<TimeSheetFetchPayload>(
      `${this.baseUrl}/resource/${resourceId}/project/${projectCode}`,
      { params }
    );
  }

  approveTimeSheetData(timesheetApprovalPayload: TimesheetApprovalPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval`, timesheetApprovalPayload, { responseType: 'text' as 'json' });
  }
}
