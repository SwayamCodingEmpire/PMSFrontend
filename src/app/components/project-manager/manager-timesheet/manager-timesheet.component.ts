import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-timesheet',
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-timesheet.component.html',
  styleUrl: './manager-timesheet.component.scss'
})
export class ManagerTimesheetComponent {

  currentStartDate = new Date('2025-06-23');
  selectedProject = '';
  selectedTimesheet: any = null;
  activeTab: 'pending' | 'history' = 'pending';
  page = 1;
  pageSize = 5;
  timesheets = [
    {
      resource: 'Rohit Verma',
      role: 'Developer',
      project: 'Code001',
      status: 'Submitted',
      referenceHours: 40,
      week: [3, 8, 4, 0, 0, 0, 0]
    },
    {
      resource: 'Sneha Patel',
      role: 'Tester',
      project: 'Code002',
      status: 'Approved',
      referenceHours: 40,
      week: [5, 0, 2, 8, 0, 0, 0]
    },
    {
      resource: 'Ankit Sharma',
      role: 'Analyst',
      project: 'Code003',
      status: 'Submitted',
      referenceHours: 40,
      week: [8, 8, 8, 8, 8, 0, 0]
    },
    {
      resource: 'Nikita Jain',
      role: 'UI Designer',
      project: 'Code001',
      status: 'Rejected',
      referenceHours: 40,
      week: [4, 4, 4, 4, 0, 0, 0]
    },
    {
      resource: 'Amit Das',
      role: 'BA',
      project: 'Code004',
      status: 'Submitted',
      referenceHours: 40,
      week: [6, 6, 6, 6, 6, 0, 0]
    },
    {
      resource: 'Priya Raj',
      role: 'Tester',
      project: 'Code002',
      status: 'Approved',
      referenceHours: 40,
      week: [8, 8, 8, 8, 8, 0, 0]
    },
    {
      resource: 'Vikram Singh',
      role: 'Developer',
      project: 'Code005',
      status: 'Submitted',
      referenceHours: 40,
      week: [7, 7, 7, 7, 7, 0, 0]
    }
  ];
  Math = Math;
  get currentWeekRange(): string {
    const end = new Date(this.currentStartDate);
    end.setDate(end.getDate() + 6);
    return `${this.format(this.currentStartDate)} - $
{this.format(end)}`;
  }
  format(date: Date): string {
    return `${date.toLocaleString('default', { month: 'short' })}
${date.getDate()}`;
  }
  get projects() {
    return [...new Set(this.timesheets.map(t => t.project))];
  }
  get filteredTimesheets() {
    const list = this.timesheets.filter(t =>
      this.activeTab === 'pending' ? t.status !== 'Approved' :
        t.status === 'Approved'
    );
    const filtered = this.selectedProject
      ? list.filter(t => t.project === this.selectedProject)
      : list;
    if ((this.page - 1) * this.pageSize >= filtered.length) {
      this.page = 1;
    }
    return filtered;
  }
  get pagedTimesheets() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTimesheets.slice(start, start +
      this.pageSize);
  }
  get totalPages() {
    return Math.ceil(this.filteredTimesheets.length /
      this.pageSize);
  }
  nextWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate()
      + 7);
    this.currentStartDate = new Date(this.currentStartDate);
  }
  prevWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate()
      - 7);
    this.currentStartDate = new Date(this.currentStartDate);
  }
  viewTimesheet(t: any) {
    this.selectedTimesheet = t;
  }
  closeView() {
    this.selectedTimesheet = null;
  }
  approveTimesheet() {
    if (this.selectedTimesheet) {
      this.selectedTimesheet.status = 'Approved';
      alert(`✅ Timesheet Approved. Email sent to $
{this.selectedTimesheet.resource}`);
      this.selectedTimesheet = null;
    }
  }
  rejectTimesheet() {
    if (this.selectedTimesheet) {
      this.selectedTimesheet.status = 'Rejected';
      alert(`❌ Timesheet Rejected. Email sent to $
{this.selectedTimesheet.resource}`);
      this.selectedTimesheet = null;
    }
  }
  get weekDays(): string[] {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
  getFilledHours(t: any): number {
    return t.week.reduce((a: number, b: number) => a + (b || 0),
      0);
  }
}
