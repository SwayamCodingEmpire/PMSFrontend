import { CommonModule } from '@angular/common';
import { Component, OnInit, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, delay } from 'rxjs';
import { ManagerTimesheetService } from '../../../services/manager/manager-timesheet.service';
import { TimesheetSummary } from '../../../models/TimesheetSummary';
import { TimesheetApprovalPayload } from '../../../models/TimesheetApprovalPayload';

// Interfaces
export interface TimeSheetFetchPayload {
  projectCode: string;
  projectName: string;
  projectTimeSheet: ProjectTimeSheet[];
}

export interface ProjectTimeSheet {
  date: Date;
  attendanceStatus: boolean;
  hoursWorked: number;
}



export interface TimesheetDetail {
  id: string;
  resource: string;
  role: string;
  project: string;
  status: string;
  timesheetData: TimeSheetFetchPayload;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Component({
  selector: 'app-manager-timesheet',
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-timesheet.component.html',
  styleUrl: './manager-timesheet.component.scss'
})
export class ManagerTimesheetComponent implements OnInit {
  // Current week tracking
  currentStartDate: Date = new Date();

  // UI State
  selectedProject = '';
  selectedTimesheet: TimesheetDetail | null = null;
  activeTab: 'pending' | 'history' = 'pending';
  page = 1;
  pageSize = 5;

  // Data
  timesheets: TimesheetSummary[] = [];
  projects: string[] = [];
  isLoading = false;
  isDetailLoading = false;

  // Static Data - Replace with API calls later
  private staticTimesheets: TimesheetSummary[] = [];

  // private static staticTimesheetDetails: { [key: string]: TimesheetDetail } = {
  //   '1': {
  //     id: '1',
  //     resource: 'Rohit Verma',
  //     role: 'Developer',
  //     project: 'Code001',
  //     status: 'Submitted',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ001',
  //         projectName: 'Apollo Dashboard',
  //         projectTimeSheet: [
  //           { date: new Date('2025-06-23'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-06-24'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-06-25'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-06-26'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-06-27'), attendanceStatus: true, hoursWorked: 8 }
  //         ]
  //       }
  //     ]
  //   },
  //   '2': {
  //     id: '2',
  //     resource: 'Sneha Patel',
  //     role: 'Tester',
  //     project: 'Code002',
  //     status: 'Approved',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ002',
  //         projectName: 'Orion Tracker',
  //         projectTimeSheet: [
  //           { date: new Date('2025-06-23'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-06-24'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-06-25'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-06-26'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-06-27'), attendanceStatus: true, hoursWorked: 7 }
  //         ]
  //       }
  //     ]
  //   },
  //   '3': {
  //     id: '3',
  //     resource: 'Ankit Sharma',
  //     role: 'Analyst',
  //     project: 'Code003',
  //     status: 'Submitted',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ003',
  //         projectName: 'Data Analytics Platform',
  //         projectTimeSheet: [
  //           { date: new Date('2025-06-30'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-01'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-02'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-03'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-04'), attendanceStatus: true, hoursWorked: 8 }
  //         ]
  //       }
  //     ]
  //   },
  //   '4': {
  //     id: '4',
  //     resource: 'Nikita Jain',
  //     role: 'UI Designer',
  //     project: 'Code001',
  //     status: 'Rejected',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ001',
  //         projectName: 'Apollo Dashboard',
  //         projectTimeSheet: [
  //           { date: new Date('2025-06-30'), attendanceStatus: true, hoursWorked: 6 },
  //           { date: new Date('2025-07-01'), attendanceStatus: true, hoursWorked: 6 },
  //           { date: new Date('2025-07-02'), attendanceStatus: true, hoursWorked: 6 },
  //           { date: new Date('2025-07-03'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-07-04'), attendanceStatus: true, hoursWorked: 7 }
  //         ]
  //       }
  //     ]
  //   },
  //   '5': {
  //     id: '5',
  //     resource: 'Amit Das',
  //     role: 'BA',
  //     project: 'Code004',
  //     status: 'Submitted',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ004',
  //         projectName: 'Business Intelligence Tool',
  //         projectTimeSheet: [
  //           { date: new Date('2025-07-07'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-08'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-09'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-10'), attendanceStatus: true, hoursWorked: 7 },
  //           { date: new Date('2025-07-11'), attendanceStatus: true, hoursWorked: 7 }
  //         ]
  //       }
  //     ]
  //   },
  //   '6': {
  //     id: '6',
  //     resource: 'Priya Raj',
  //     role: 'Tester',
  //     project: 'Code002',
  //     status: 'Approved',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ002',
  //         projectName: 'Orion Tracker',
  //         projectTimeSheet: [
  //           { date: new Date('2025-07-07'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-08'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-09'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-10'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-11'), attendanceStatus: true, hoursWorked: 8 }
  //         ]
  //       }
  //     ]
  //   },
  //   '7': {
  //     id: '7',
  //     resource: 'Vikram Singh',
  //     role: 'Developer',
  //     project: 'Code005',
  //     status: 'Submitted',
  //     timesheetData: [
  //       {
  //         projectCode: 'PRJ005',
  //         projectName: 'Mobile Application',
  //         projectTimeSheet: [
  //           { date: new Date('2025-07-07'), attendanceStatus: true, hoursWorked: 9 },
  //           { date: new Date('2025-07-08'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-09'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-10'), attendanceStatus: true, hoursWorked: 8 },
  //           { date: new Date('2025-07-11'), attendanceStatus: true, hoursWorked: 9 }
  //         ]
  //       }
  //     ]
  //   }
  // };

  constructor(private mnagerTimeSheetService:ManagerTimesheetService) {
    this.setCurrentWeekStart();
  }

  ngOnInit(): void {
    this.loadTimesheets();
  }

  // Week Management
  private setCurrentWeekStart(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    this.currentStartDate = new Date(today);
    this.currentStartDate.setDate(today.getDate() + mondayOffset);
    this.currentStartDate.setHours(0, 0, 0, 0);
  }

  private getWeekEndDate(): Date {
    const endDate = new Date(this.currentStartDate);
    endDate.setDate(endDate.getDate() + 4); // Friday (Monday + 4 days)
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }



  get currentWeekRange(): string {
    const end = this.getWeekEndDate();
    return `${this.formatDate(this.currentStartDate)} - ${this.formatDate(end)}`;
  }

  private formatDate(date: Date): string {
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
  }

  private formatDateForBackend(date: Date): string {
   return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
}


  // Static Data Load Methods (Replace with API service calls later)
  private loadTimesheets(): void {

    // Simulate API call with delay
    this.mnagerTimeSheetService.getAllTimesheetSummaryReviewForManager(this.currentStartDate.toISOString().split('T')[0] ,this.getWeekEndDate().toISOString().split('T')[0]).subscribe({
      next: (response) => {

          this.timesheets = response;
          this.isLoading = false;
          this.updateProjects();
          this.resetPagination();
        },
      error: (error) => {
        this.handleError('Error loading timesheets', error.message);
        this.isLoading = false;
      }
    });
  }

  // private getTimesheets(): Observable<ApiResponse<TimesheetSummary[]>> {
  //   const startDate = this.currentStartDate;
  //   const endDate = this.getWeekEndDate();

  //   // Filter timesheets by current week and tab
  //   const filteredData = ManagerTimesheetComponent.staticTimesheets.filter(timesheet => {
  //     const weekStart = new Date(timesheet.weekStartDate);
  //     const weekEnd = new Date(timesheet.weekEndDate);

  //     // Check if timesheet week overlaps with current week
  //     const isInDateRange = (weekStart <= endDate && weekEnd >= startDate);

  //     // Filter by tab
  //     const isInTab = this.activeTab === 'pending'
  //       ? timesheet.status !== 'Approved'
  //       : timesheet.status === 'Approved';

  //     return isInDateRange && isInTab;
  //   });

  //   // Simulate API delay
  //   return of({
  //     success: true,
  //     data: filteredData,
  //     message: 'Timesheets loaded successfully'
  //   }).pipe(delay(500));
  // }

  // private getTimesheetDetail(id: string): Observable<ApiResponse<TimesheetDetail>> {
  //   const detail = ManagerTimesheetComponent.staticTimesheetDetails[id];

  //   if (detail) {
  //     return of({
  //       success: true,
  //       data: detail,
  //       message: 'Timesheet detail loaded successfully'
  //     }).pipe(delay(100));
  //   } else {
  //     return of({
  //       success: false,
  //       data: null as any,
  //       message: 'Timesheet not found'
  //     }).pipe(delay(100));
  //   }
  // }

  // private approveTimesheetApi(id: string): Observable<ApiResponse<any>> {
  //   // Update static data
  //   const timesheet = ManagerTimesheetComponent.staticTimesheets.find(t => t.id === id);
  //   if (timesheet) {
  //     timesheet.status = 'Approved';
  //   }

  //   const detail = ManagerTimesheetComponent.staticTimesheetDetails[id];
  //   if (detail) {
  //     detail.status = 'Approved';
  //   }

  //   return of({
  //     success: true,
  //     data: { id, status: 'Approved' },
  //     message: 'Timesheet approved successfully'
  //   }).pipe(delay(400));
  // }

  // private rejectTimesheetApi(id: string): Observable<ApiResponse<any>> {
  //   // Update static data
  //   const timesheet = ManagerTimesheetComponent.staticTimesheets.find(t => t.id === id);
  //   if (timesheet) {
  //     timesheet.status = 'Rejected';
  //   }

  //   const detail = ManagerTimesheetComponent.staticTimesheetDetails[id];
  //   if (detail) {
  //     detail.status = 'Rejected';
  //   }

  //   return of({
  //     success: true,
  //     data: { id, status: 'Rejected' },
  //     message: 'Timesheet rejected successfully'
  //   }).pipe(delay(400));
  // }

  // UI Event Handlers
  nextWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.currentStartDate = new Date(this.currentStartDate);
    this.loadTimesheets();
  }

  prevWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
    this.currentStartDate = new Date(this.currentStartDate);
    this.loadTimesheets();
  }




onTabChange(tab: 'pending' | 'history'): void {
  this.activeTab = tab;
  this.page = 1; // Reset to first page
}


  onProjectFilterChange(): void {
    this.resetPagination();
  }

  onPageSizeChange(): void {
    this.resetPagination();
  }

  viewTimesheet(timesheet: TimesheetSummary, index:number): void {
    this.isDetailLoading = true;
    this.selectedTimesheet = {
      id: timesheet.resourceId,
      resource: timesheet.resourceName,
      role: timesheet.role,
      project: timesheet.projectCode,
      status: timesheet.status,
      timesheetData: {
        projectCode: timesheet.projectCode,
        projectName: timesheet.projectName,
        projectTimeSheet: []
      }
    };

    this.mnagerTimeSheetService.getTimesheetForResourceAndProject(timesheet.resourceId, timesheet.projectCode, this.currentStartDate.toISOString().split('T')[0] ,this.getWeekEndDate().toISOString().split('T')[0]).subscribe({
      next: (response) => {

        console.log('Timesheet details loaded:', response);
          if (this.selectedTimesheet) {
            console.log('Updating existing timesheet data');
            this.selectedTimesheet.timesheetData.projectCode = response.projectCode;
            this.selectedTimesheet.timesheetData.projectName = response.projectName;
            this.selectedTimesheet.timesheetData.projectTimeSheet = response.projectTimeSheet;
          }
          this.isDetailLoading = false;

          console.log('Setting selected timesheet:', this.selectedTimesheet?.timesheetData);

      },
      error: (error) => {
        this.handleError('Error loading timesheet details', error.message);
        this.isDetailLoading = false;
      }
    });
  }

  closeView(): void {
    this.selectedTimesheet = null;
  }

  approveTimesheet(apporve: boolean): void {
    if (!this.selectedTimesheet)
    {
      this.handleError('No timesheet selected', 'Please select a timesheet to approve.');
      return;
    }
    else{
      console.log('Approving timesheet:', this.selectedTimesheet);

      const { startDate, endDate } = this.getTimesheetDateRange(this.selectedTimesheet);
      let timesheetApprovalPayload: TimesheetApprovalPayload = {
        resourceId: this.selectedTimesheet.id,
        projectId: this.selectedTimesheet.project,
        startDate: startDate,
        endDate: endDate,
        approve: apporve
      };

      console.log('Timesheet approval payload:', timesheetApprovalPayload);

      this.mnagerTimeSheetService.approveTimeSheetData(timesheetApprovalPayload).subscribe({
        next: (response) => {
          console.log('Timesheet approval response:', response);
        },
        error: (error) => {
          this.handleError('Error approving timesheet', error.message);
        }
      });

    }

  }

  // rejectTimesheet(): void {
  //   if (!this.selectedTimesheet) return;

  //   this.rejectTimesheetApi(this.selectedTimesheet.id).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.selectedTimesheet!.status = 'Rejected';
  //         this.showSuccessMessage(`❌ Timesheet Rejected. Email sent to ${this.selectedTimesheet!.resource}`);
  //         this.selectedTimesheet = null;
  //         this.loadTimesheets(); // Refresh the list
  //       } else {
  //         this.handleError('Failed to reject timesheet', response.message);
  //       }
  //     },
  //     error: (error) => {
  //       this.handleError('Error rejecting timesheet', error.message);
  //     }
  //   });
  // }

  // Data Processing
  private updateProjects(): void {
    this.projects = [...new Set(this.timesheets.map(t => t.projectCode))];
  }

  private resetPagination(): void {
    this.page = 1;
  }

  // Computed Properties
get filteredTimesheets(): TimesheetSummary[] {
  let filtered = this.timesheets;

  // Filter by active tab
  if (this.activeTab === 'pending') {
    filtered = filtered.filter(t => t.status === 'PENDING' || t.status === 'SUBMITTED');
  } else if (this.activeTab === 'history') {
    filtered = filtered.filter(t => t.status !== 'PENDING');
  }

  // Filter by selected project
  if (this.selectedProject) {
    filtered = filtered.filter(t => t.projectCode === this.selectedProject);
  }

  // Reset page if current page is out of range
  if ((this.page - 1) * this.pageSize >= filtered.length && filtered.length > 0) {
    this.page = 1;
  }

  return filtered;
}


  get pagedTimesheets(): TimesheetSummary[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTimesheets.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTimesheets.length / this.pageSize);
  }

get processedTimesheetData(): any {
  if (!this.selectedTimesheet) return null;

  const days = this.getWeekDays();
  const project = this.selectedTimesheet.timesheetData;

  const hours = days.map(day => {
    const dayData = project.projectTimeSheet.find(ts =>
      new Date(ts.date).toDateString() === day.toDateString()
    );
    return dayData ? dayData.hoursWorked : 0;
  });

  const rowTotal = hours.reduce((sum, h) => sum + h, 0);

  const projectData = [{
    code: project.projectCode,
    name: project.projectName,
    hours,
    rowTotal
  }];

  const dayTotals = days.map((_, dayIndex) =>
    projectData.reduce((sum, proj) => sum + proj.hours[dayIndex], 0)
  );

  const grandTotal = dayTotals.reduce((sum, total) => sum + total, 0);

  return {
    projects: projectData,
    dayTotals,
    grandTotal,
    days: days.map(date => ({ date }))
  };
}


  private getWeekDays(): Date[] {
    const days = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = new Date(this.currentStartDate);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // Utility Methods
  private handleError(title: string, message: string): void {
    console.error(title, message);
    alert(`${title}: ${message}`);
  }

  private showSuccessMessage(message: string): void {
    alert(message);
  }

  private getTimesheetDateRange(timesheet: TimesheetDetail): { startDate: Date; endDate: Date } {
  const dates = timesheet.timesheetData.projectTimeSheet.map(pt => new Date(pt.date));

  if (dates.length === 0) {
    throw new Error('No dates available in projectTimeSheet');
  }

  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  return { startDate, endDate };
}

}
