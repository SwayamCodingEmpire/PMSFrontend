import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

type Project = { code: string; name: string; };
type DayEntry = { hours: number | null; leave: boolean; };

@Component({
  selector: 'app-resource-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule,FlexLayoutModule],
  templateUrl: './resource-timesheet.component.html',
  styleUrls: ['./resource-timesheet.component.scss']
})
export class ResourceTimesheetComponent {

  user = { name: 'Jayaprakash' };
  projects: Project[] = [
    { code: 'P001', name: 'Project Code 1' },
    { code: 'P002', name: 'Project Code 2' }
  ];

  weekStart = new Date(2025, 5, 23); // 23 June 2025 (month is 0-indexed)
  days: { date: Date }[] = [];

  timesheet: Record<string, DayEntry[]> = {};

  notification = '';
  notificationType: 'success' | 'danger' | '' = '';

  dayDropdownOpen: number | null = null;

  constructor() {
    this.updateWeekDays();
    this.initializeTimesheet();
  }

  updateWeekDays() {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + i);
      this.days.push({ date });
    }
  }

  initializeTimesheet() {
    this.timesheet = {};
    for (const project of this.projects) {
      this.timesheet[project.code] = Array(7).fill(0).map(() => ({ hours: null, leave: false }));
    }
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  prevWeek() {
    this.weekStart.setDate(this.weekStart.getDate() - 7);
    this.updateWeekDays();
    this.initializeTimesheet();
  }

  nextWeek() {
    this.weekStart.setDate(this.weekStart.getDate() + 7);
    this.updateWeekDays();
    this.initializeTimesheet();
  }

  toggleDayDropdown(idx: number) {
    this.dayDropdownOpen = this.dayDropdownOpen === idx ? null : idx;
  }

  closeDayDropdown() {
    this.dayDropdownOpen = null;
  }

  setHours(projectCode: string, dayIdx: number, value: number | string) {
    if (this.isWeekend(this.days[dayIdx].date)) return;
    const entry = this.timesheet[projectCode][dayIdx];
    entry.hours = value === '' ? null : Number(value);
    if (entry.hours && entry.hours > 0) entry.leave = false;
  }

  markAllLeave(dayIdx: number) {
    if (this.isWeekend(this.days[dayIdx].date)) return;
    for (const project of this.projects) {
      this.timesheet[project.code][dayIdx].leave = true;
      this.timesheet[project.code][dayIdx].hours = null;
    }
    this.showNotification('Marked all as leave for this day.', 'success');
    this.closeDayDropdown();
  }

  markProjectLeave(projectCode: string, dayIdx: number) {
    if (this.isWeekend(this.days[dayIdx].date)) return;
    const entry = this.timesheet[projectCode][dayIdx];
    entry.leave = true;
    entry.hours = null;
    this.showNotification(`${projectCode} marked as leave.`, 'success');
    this.closeDayDropdown();
  }

  dayTotal(dayIdx: number): number {
    if (this.isWeekend(this.days[dayIdx].date)) return 0;
    let sum = 0;
    for (const project of this.projects) {
      const entry = this.timesheet[project.code][dayIdx];
      if (!entry.leave && entry.hours) sum += entry.hours;
    }
    return sum;
  }

  rowTotal(projectCode: string): number {
    return this.timesheet[projectCode]
      .map((entry, idx) => this.isWeekend(this.days[idx].date) ? 0 : (entry.leave ? 0 : (entry.hours || 0)))
      .reduce((acc, val) => acc + val, 0);
  }

  calculateGrandTotal(): number {
    let total = 0;
    for (const project of this.projects) {
      for (let d = 0; d < 7; d++) {
        if (this.isWeekend(this.days[d].date)) continue;
        const entry = this.timesheet[project.code][d];
        if (!entry.leave && entry.hours) total += entry.hours;
      }
    }
    return total;
  }

  weekPeriod(): string {
  const start = this.days[0].date;
  const end = this.days[6].date;

  // Helper for ordinal suffix
  function ordinal(day: number): string {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }

  const startDay = ordinal(start.getDate());
  const endDay = ordinal(end.getDate());
  const startMonth = start.toLocaleString('default', { month: 'long' });
  const endMonth = end.toLocaleString('default', { month: 'long' });

  // If same month
  if (startMonth === endMonth) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${end.getFullYear()}`;
  } else {
    // If week spans two months
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${end.getFullYear()}`;
  }
}


  saveDay(dayIdx: number) {
    let saved = false;
    for (const project of this.projects) {
      const entry = this.timesheet[project.code][dayIdx];
      if (entry.hours !== null && !entry.leave) saved = true;
    }
    this.showNotification(
      saved ? `Saved entries for ${this.days[dayIdx].date.toDateString()}` : `No hours entered for this day`,
      saved ? 'success' : 'danger'
    );
  }

  submitTimesheet() {
    for (let day = 0; day < 7; day++) {
      if (this.isWeekend(this.days[day].date)) continue;
      let anyEntry = false;
      for (const project of this.projects) {
        const entry = this.timesheet[project.code][day];
        if (entry.hours || entry.leave) anyEntry = true;
      }
      if (!anyEntry) {
        this.showNotification('Please fill hours or mark leave for all working days.', 'danger');
        return;
      }
    }
    this.showNotification('Timesheet submitted successfully!', 'success');
  }

  showNotification(message: string, type: 'success' | 'danger') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.clearNotification(), 3000);
  }

  clearNotification() {
    this.notification = '';
    this.notificationType = '';
  }
}
