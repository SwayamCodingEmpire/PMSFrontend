import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResourceAllocationService } from '../../../services/manager/resource-allocation.service';
import { ResourceTimesheetService } from '../../../services/resources/resource-timesheet.service';
import { TimeSheetFetchPayload } from '../../../models/TimeSheetFetchPayload';
import { SingularTimesheetPayload } from '../../../models/SingularTimesheetPayload';
import { DayWiseTimesheet } from '../../../models/DayWiseTimesheet';
import { ProjectTimeSheet } from '../../../models/ProjectTimeSheet';

type Project = { code: string; name: string; };
type DayEntry = { hours: number | null; leave: boolean; approvalStatus: string | null; };

@Component({
  selector: 'app-resource-timesheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FlexLayoutModule],
  templateUrl: './resource-timesheet.component.html',
  styleUrls: ['./resource-timesheet.component.scss']
})
export class ResourceTimesheetComponent implements OnInit, OnDestroy {

  isButtonDisabled = true;
  isLoading = false;
  isSaving = false;

  user = { name: localStorage.getItem('name') || '' };
  projects: Project[] = [];

  weekStart = new Date();
  days: { date: Date }[] = [];

  timesheet: Record<string, DayEntry[]> = {};
  timesheetForm: FormGroup;

  notification = '';
  notificationType: 'success' | 'danger' | '' = '';

  dayDropdownOpen: number | null = null;

  // Auto-save tracking
  private lastFocusedDay: number | null = null;
  private hasUnsavedChanges: Map<number, boolean> = new Map();
  
  // Click outside handler
  private clickOutsideHandler = this.handleClickOutside.bind(this);

  constructor(
    private resourceTimesheetService: ResourceTimesheetService,
    private fb: FormBuilder
  ) {
    this.timesheetForm = this.fb.group({});
    this.setCurrentWeekStart();
  }

  setCurrentWeekStart() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days to subtract to get to Monday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    this.weekStart = new Date(today);
    this.weekStart.setDate(today.getDate() - daysToSubtract);
    this.weekStart.setHours(0, 0, 0, 0); // Reset time to start of day
  }

  ngOnInit() {
    const today = new Date();
    this.setCurrentWeekStart(); // Ensure week start is set first
    this.loadTimesheetData(today);
    
    // Setup auto-save on page unload
    this.setupAutoSaveOnUnload();
    
    // Setup click outside to close dropdowns
    this.setupClickOutsideHandler();
  }

  ngOnDestroy() {
    // Auto-save any pending changes before component destruction
    this.autoSaveAllPendingChanges();
    
    // Clean up event listeners
    this.removeClickOutsideHandler();
  }

  checkButtonDisabled(day: { date: Date }): boolean {
    const dayIdx = this.getDayIndex(day.date);

    // If there are no projects, keep the button enabled
    if (this.projects.length === 0) return false;

    // Return true only if ALL projects have approvalStatus === 'APPROVED' for that day
    return this.projects.every(project => {
      const entries = this.timesheet[project.code];
      const entry = entries?.[dayIdx];
      return entry?.approvalStatus === 'APPROVED';
    });
  }


  getDayIndex(date: Date): number {
    const start = new Date(this.weekStart);
    start.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }



  loadTimesheetData(today: Date) {
    this.isLoading = true;

    // Use the same calculation as setCurrentWeekStart for consistency
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    this.weekStart = new Date(today);
    this.weekStart.setDate(today.getDate() - daysToSubtract);
    this.weekStart.setHours(0, 0, 0, 0); // Reset time to start of day

    const weekEnd = new Date(this.weekStart);
    weekEnd.setDate(this.weekStart.getDate() + 6); // Sunday

    const startDateStr = this.weekStart.toISOString().split('T')[0];
    const endDateStr = weekEnd.toISOString().split('T')[0];

    console.log('Week range:', startDateStr, 'to', endDateStr);

    // Fetch from API
    this.resourceTimesheetService.getTimeSheetData(startDateStr, endDateStr).subscribe({
      next: (timeSheetData) => {
      // Generate week dates BEFORE processing data
      this.updateWeekDays();

      const weekDates = this.days.map(day => day.date.toDateString());
      console.log('Generated week dates:', weekDates);

      this.projects = [];
      this.timesheet = {};

      // Remove duplicates from projects
      const seenProjects = new Set();
      for (const entry of timeSheetData) {
        console.log('Processing entry:', entry);
        if (!seenProjects.has(entry.projectCode)) {
          this.projects.push({ code: entry.projectCode, name: entry.projectName });
          seenProjects.add(entry.projectCode);
        }

        console.log('Project resources for:', entry.projectCode, entry.projectTimeSheet);
        console.log('Seen projects:', seenProjects);

        this.timesheet[entry.projectCode] = weekDates.map(dateStr => {
          const matched = entry.projectTimeSheet.find(
            ts => new Date(ts.date).toDateString() === dateStr
          );
          return {
            hours: matched ? matched.hoursWorked : null,
            leave: matched ? !matched.attendanceStatus : false,
            approvalStatus: matched ? matched.approvalStatus : null
          };
        });
      }

      console.log('Final projects:', this.projects);
      console.log('Final timesheet data:', this.timesheet);
      console.log('Days array:', this.days);

      this.initializeTimesheetForm();
      
      // Reset unsaved changes tracking when new data is loaded
      this.hasUnsavedChanges.clear();
      this.lastFocusedDay = null;
      
      this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading timesheet data:', error);
        this.showNotification('Failed to load timesheet data. Please try again.', 'danger');
        this.isLoading = false;
      }
    });
  }

  ngOnChanges() {

    console.log('ngOnChanges called');

    this.projects.forEach(project => {
      this.days.forEach((day, dIndex) => {
        const controlName = this.getFormControlName(project.code, dIndex);
        const control = this.timesheetForm.get(controlName); // adjust as per your form group structure
        const isLeave = this.timesheet[project.code][dIndex].leave;
        const isWeekendDay = this.isWeekend(day.date);

        if (isLeave || isWeekendDay) {
          control?.disable();
        } else {
          control?.enable();
        }
      });
    });
  }

  initializeTimesheetForm() {
    const group: { [key: string]: FormControl } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const project of this.projects) {
      for (let d = 0; d < 7; d++) {
        const controlName = this.getFormControlName(project.code, d);
        const hours = this.timesheet[project.code][d].hours ?? '';
        const controlDate = new Date(this.days[d].date);
        controlDate.setHours(0, 0, 0, 0);

        const isLeave = this.timesheet[project.code][d].leave;
        const isWeekendDay = this.isWeekend(this.days[d].date);
        const isApproved = this.timesheet[project.code][d].approvalStatus === 'APPROVED';
        const isFuture = controlDate > today;

        const shouldDisable = isLeave || isWeekendDay || isApproved || isFuture;

        group[controlName] = new FormControl({ value: hours, disabled: shouldDisable });
      }
    }

    console.log('Creating form controls for:');
    console.log('Projects:', this.projects);
    console.log('Days:', this.days);


    this.timesheetForm = new FormGroup(group);
  }






  updateWeekDays() {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.weekStart);
      date.setDate(this.weekStart.getDate() + i);
      this.days.push({ date });
    }
    console.log('Updated days:', this.days.map(d => `${d.date.toDateString()} (${d.date.getDay()})`));
  }

  initializeTimesheetWithData() {
    const formControls: any = {};

    for (const project of this.projects) {
      // Create form controls for each project-day combination with actual data
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const controlName = `${project.code}_${dayIdx}`;
        const hoursValue = this.timesheet[project.code][dayIdx].hours;
        formControls[controlName] = this.fb.control(hoursValue);
      }
    }

    this.timesheetForm = this.fb.group(formControls);
  }

  initializeTimesheet() {
    this.timesheet = {};
    const formControls: any = {};

    for (const project of this.projects) {
      this.timesheet[project.code] = Array(7).fill(0).map(() => ({ hours: null, leave: false, approvalStatus: 'PENDING' }));

      // Create form controls for each project-day combination
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const controlName = `${project.code}_${dayIdx}`;
        formControls[controlName] = this.fb.control(null);
      }
    }

    this.timesheetForm = this.fb.group(formControls);
  }

  isWeekend(date: Date): boolean {

    const day = date.getDay();

    return day === 0 || day === 6; // Sunday or Saturday
  }

  prevWeek() {
    console.log('Previous week clicked, current weekStart:', this.weekStart);
    const prevFriday = new Date(this.weekStart);
    prevFriday.setDate(prevFriday.getDate() - 3);
    console.log('Loading data for:', prevFriday);
    this.loadTimesheetData(prevFriday);
  }

  nextWeek() {
    console.log('Next week clicked, current weekStart:', this.weekStart);
    const nextMonday = new Date(this.weekStart);
    nextMonday.setDate(nextMonday.getDate() + 7);
    console.log('Loading data for:', nextMonday);
    this.loadTimesheetData(nextMonday);
  }

  // 5. Alternative approach - more explicit week calculation
  private calculateWeekDates(referenceDate: Date): Date[] {
    const dates: Date[] = [];
    const dayOfWeek = referenceDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(referenceDate);
    monday.setDate(referenceDate.getDate() - daysToSubtract);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  }


  loadWeekData() {
    // Generate array of week dates for the current week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(this.weekStart);
      date.setDate(this.weekStart.getDate() + i);
      return date.toDateString();
    });

    // Get fresh data for the new week
    const timeSheetData: TimeSheetFetchPayload[] = [];

    // Update timesheet with data for the new week
    for (const entry of timeSheetData) {
      if (this.timesheet[entry.projectCode]) {
        this.timesheet[entry.projectCode] = weekDates.map(dateStr => {
          const matchedEntry = entry.projectTimeSheet.find(
            ts => new Date(ts.date).toDateString() === dateStr
          );
          return {
            hours: matchedEntry ? matchedEntry.hoursWorked : null,
            leave: false
            , approvalStatus: matchedEntry ? matchedEntry.approvalStatus : null
          };
        });
      }
    }

    // Update form controls with new data
    this.updateFormControls();
  }
  updateFormControls() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize

    for (const project of this.projects) {
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const controlName = this.getFormControlName(project.code, dayIdx);
        const hoursValue = this.timesheet[project.code][dayIdx].hours;
        const control = this.timesheetForm.get(controlName);

        const controlDate = new Date(this.days[dayIdx].date);
        controlDate.setHours(0, 0, 0, 0);

        const isLeave = this.timesheet[project.code][dayIdx].leave;
        const isWeekendDay = this.isWeekend(this.days[dayIdx].date);
        const isApproved = this.timesheet[project.code][dayIdx].approvalStatus === 'APPROVED';
        const isFuture = this.stripTime(controlDate) > this.stripTime(today);

        const shouldDisable = isLeave || isWeekendDay || isApproved || isFuture;

        if (control) {
          control.setValue(hoursValue, { emitEvent: false });

          if (shouldDisable) {
            control.disable({ emitEvent: false });
          } else {
            control.enable({ emitEvent: false });
          }
        }
      }
    }
  }



  isFutureDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize for comparison
    return this.stripTime(date) > this.stripTime(today);
  }


  toggleDayDropdown(idx: number) {
    this.dayDropdownOpen = this.dayDropdownOpen === idx ? null : idx;
  }

  closeDayDropdown() {
    this.dayDropdownOpen = null;
  }

  getFormControlName(projectCode: string, dayIdx: number): string {
    return `${projectCode}_${dayIdx}`;
  }

  setHours(projectCode: string, dayIdx: number, value: number | string) {
    if (this.isWeekend(this.days[dayIdx].date)) return;
    const entry = this.timesheet[projectCode][dayIdx];
    entry.hours = value === '' ? null : Number(value);
    if (entry.hours && entry.hours > 0) entry.leave = false;

    // Update form control
    const controlName = this.getFormControlName(projectCode, dayIdx);
    this.timesheetForm.get(controlName)?.setValue(entry.hours);
  }
  markAllLeave(dayIdx: number, suppressNotification: boolean = false) {
    if (this.isWeekend(this.days[dayIdx].date)) return;

    const isCurrentlyLeave = this.projects.every(project => {
      const entry = this.timesheet[project.code][dayIdx];
      const controlName = this.getFormControlName(project.code, dayIdx);
      const control = this.timesheetForm.get(controlName);
      return control?.disabled || entry.leave;
    });

    for (const project of this.projects) {
      const entry = this.timesheet[project.code][dayIdx];

      // Skip changes for APPROVED entries
      if (entry.approvalStatus === 'APPROVED') continue;

      const controlName = this.getFormControlName(project.code, dayIdx);
      const control = this.timesheetForm.get(controlName);
      if (!control) continue;

      if (!isCurrentlyLeave) {
        // Mark as leave
        entry.leave = true;
        entry.hours = 0;
        control.setValue(0);
        control.disable();
      } else {
        // Unmark leave
        entry.leave = false;
        entry.hours = 0;
        control.setValue(null);
        control.enable();
      }
    }

    if (!suppressNotification) {
      this.showNotification(
        isCurrentlyLeave
          ? 'Removed leave for non-approved projects.'
          : 'Marked non-approved projects as leave.',
        'success'
      );
    }
    this.closeDayDropdown();
  }

  markProjectLeave(projectCode: string, dayIdx: number, suppressNotification: boolean = false) {
    if (this.isWeekend(this.days[dayIdx].date)) return;

    const entry = this.timesheet[projectCode][dayIdx];
    if (entry.approvalStatus === 'APPROVED') return;

    const controlName = this.getFormControlName(projectCode, dayIdx);
    const control = this.timesheetForm.get(controlName);
    if (!control) return;

    const wasOnLeave = entry.leave; // Track previous state

    if (!entry.leave) {
      // Mark as leave
      entry.leave = true;
      entry.hours = 0;
      control.setValue(0);
      control.disable();
    } else {
      // Unmark leave
      entry.leave = false;
      entry.hours = null;
      control.setValue(null);
      control.enable();
    }

    if (!suppressNotification) {
      this.showNotification(
        entry.leave
          ? `${projectCode} marked as leave.`
          : `${projectCode} leave removed.`,
        'success'
      );
    }
    this.closeDayDropdown();
  }







  onHoursChange(projectCode: string, dayIdx: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.setHours(projectCode, dayIdx, value);
    
    // Mark this day as having unsaved changes
    this.hasUnsavedChanges.set(dayIdx, true);
  }

  onInputFocus(projectCode: string, dayIdx: number) {
    // Auto-save the previously focused day if it has unsaved changes
    if (this.lastFocusedDay !== null && 
        this.lastFocusedDay !== dayIdx && 
        this.hasUnsavedChanges.get(this.lastFocusedDay)) {
      this.autoSaveDay(this.lastFocusedDay);
    }
    
    // Update the currently focused day
    this.lastFocusedDay = dayIdx;
  }

  onInputBlur(projectCode: string, dayIdx: number) {
    // Auto-save when input loses focus if there are unsaved changes
    if (this.hasUnsavedChanges.get(dayIdx)) {
      // Use a small delay to avoid conflicts with focus events
      setTimeout(() => {
        this.autoSaveDay(dayIdx);
      }, 100);
    }
  }

  private autoSaveDay(dayIdx: number) {
    if (!this.hasUnsavedChanges.get(dayIdx) || this.isSaving) {
      return;
    }

    // Check if it's a future date
    if (this.isFutureDate(this.days[dayIdx].date)) {
      return;
    }

    // Perform auto-save
    this.saveDay(dayIdx, true); // Pass true to indicate this is an auto-save
    
    // Clear the unsaved changes flag
    this.hasUnsavedChanges.set(dayIdx, false);
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

  saveDay(dayIdx: number, isAutoSave: boolean = false) {
    this.isSaving = true;
    let saved = false;
    const dayDate = this.days[dayIdx].date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayDate > today) {
      if (!isAutoSave) {
        this.showNotification('Cannot save future dates.', 'danger');
      }
      this.isSaving = false;
      return;
    }

    const dayTimeSheet: DayWiseTimesheet[] = [];

    for (const project of this.projects) {
      const entry = this.timesheet[project.code][dayIdx];
      const controlName = this.getFormControlName(project.code, dayIdx);
      const control = this.timesheetForm.get(controlName);
      const controlValue = control?.value;

      // Skip APPROVED entries always
      if (entry.approvalStatus === 'APPROVED') continue;

      // Save if not null and not empty, including leave with hours = 0
      if (
        entry &&
        (controlValue !== null && controlValue !== undefined && controlValue !== '' || entry.leave)
      ) {
        saved = true;
        dayTimeSheet.push({
          projectCode: project.code,
          attendanceStatus: !entry.leave,
          hoursWorked: entry.leave ? 0 : Number(controlValue)
        });
      }
    }

    const singularTimesheetPayload: SingularTimesheetPayload = {
      // Convert to YYYY-MM-DD string, cast to Date to satisfy TS type
      date: this.dayDateToIso(dayDate) as unknown as Date,
      dayTimeSheet: dayTimeSheet
    };

    console.log(singularTimesheetPayload);

    this.resourceTimesheetService.saveTimeSheetData(singularTimesheetPayload).subscribe({
      next: (response) => {
        console.log(singularTimesheetPayload);
        console.log('Timesheet saved successfully:', response);
        this.isSaving = false;
        
        // Show different notifications for manual vs auto-save
        if (!isAutoSave) {
          this.showNotification(
            saved
              ? `Saved entries for ${dayDate.toDateString()}`
              : `No hours entered for this day`,
            saved ? 'success' : 'danger'
          );
        }
      },
      error: (error) => {
        console.error('Error saving timesheet:', error);
        if (!isAutoSave) {
          this.showNotification('Failed to save timesheet. Please try again.', 'danger');
        }
        this.isSaving = false;
      }
    });

    // Show notification only for manual saves
    if (!isAutoSave) {
      this.showNotification(
        saved
          ? `Saved entries for ${dayDate.toDateString()}`
          : `No hours entered for this day`,
        saved ? 'success' : 'danger'
      );
    }
  }

  dayDateToIso(date: Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Remove timezone offset
  return d.toISOString().split('T')[0]; // Return YYYY-MM-DD
}


  private generateTimeSheetPayload(status: 'PENDING' | 'SUBMITTED'): TimeSheetFetchPayload[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeSheetPayload: TimeSheetFetchPayload[] = [];

    for (const project of this.projects) {
      const projectTimeSheet: ProjectTimeSheet[] = [];

      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const dayDate = this.days[dayIdx].date;
        const entry = this.timesheet[project.code][dayIdx];
        const controlName = this.getFormControlName(project.code, dayIdx);
        const control = this.timesheetForm.get(controlName);

        const isWeekendDay = this.isWeekend(dayDate);
        const isFutureDay = this.stripTime(dayDate) > this.stripTime(today);
        const isDisabled = control?.disabled || false;

        if (isWeekendDay || isFutureDay || isDisabled) continue;

        const hoursWorked = entry.leave ? 0 : (control?.value ? Number(control.value) : 0);

        projectTimeSheet.push({
          date: this.normalizeDate(dayDate),
          attendanceStatus: !entry.leave,
          hoursWorked: hoursWorked,
          approvalStatus: status // PENDING for save, SUBMITTED for submit
        });
      }

      timeSheetPayload.push({
        projectCode: project.code,
        projectName: project.name,
        projectTimeSheet: projectTimeSheet
      });
    }

    return timeSheetPayload;
  }


  stripTime(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }


  submitTimesheet() {
    if (this.isSaving) {
      this.showNotification('Please wait for current save operation to complete.', 'danger');
      return;
    }

    this.isSaving = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate that all working days have entries
    for (let day = 0; day < 7; day++) {
      if (this.isWeekend(this.days[day].date)) continue;
      let anyEntry = false;
      for (const project of this.projects) {
        const entry = this.timesheet[project.code][day];
        if (entry.hours || entry.leave) anyEntry = true;
      }
      if (!anyEntry) {
        this.showNotification('Please fill hours or mark leave for all working days.', 'danger');
        this.isSaving = false;
        return;
      }
    }

    // Prepare data in TimeSheetFetchPayload format
    const timeSheetPayload: TimeSheetFetchPayload[] = [];

    for (const project of this.projects) {
      const projectTimeSheet: ProjectTimeSheet[] = [];

      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const dayDate = this.days[dayIdx].date;
        const entry = this.timesheet[project.code][dayIdx];
        const controlName = this.getFormControlName(project.code, dayIdx);
        const control = this.timesheetForm.get(controlName);

        // Check if control is disabled (weekend or leave)
        const isDisabled = control?.disabled || false;
        const isWeekendDay = this.isWeekend(dayDate);
        const isFutureDay = this.stripTime(dayDate) > this.stripTime(today);


        let hoursWorked: number;
        let absent: boolean;

        if (isWeekendDay || isFutureDay) {
          // For weekends, set hours to 0 and absent to false
          continue;
        } else if (entry.leave) {
          // If marked as leave, set hours to 0 and absent to true
          hoursWorked = 0;
          absent = true;
        } else if (isDisabled) {
          // If disabled for other reasons, set hours to 0 and absent to false
          continue;
        } else {
          // For regular working days, get the actual hours or default to 0
          const controlValue = control?.value;
          hoursWorked = controlValue && controlValue !== '' ? Number(controlValue) : 0;
          absent = false;
        }

        projectTimeSheet.push({
          date: this.normalizeDate(dayDate),
          attendanceStatus: !absent,
          hoursWorked: hoursWorked,
          approvalStatus: 'SUBMITTED' // Default to 'PENDING' if not set
        });
      }

      timeSheetPayload.push({
        projectCode: project.code,
        projectName: project.name,
        projectTimeSheet: projectTimeSheet
      });
    }



    console.log('Submitting timesheet:', timeSheetPayload);

    //use the resourse timesheet service to submit the timesheet data

    this.resourceTimesheetService.submitTimeSheetData(timeSheetPayload).subscribe({
      next: (response) => {
        console.log('Timesheet submitted successfully:', response);
        this.showNotification('Timesheet submitted successfully!', 'success');
        this.isSaving = false;
        // Optionally reload data to reflect new status
        this.loadTimesheetData(new Date());
      },
      error: (error) => {
        console.error('Error submitting timesheet:', error);
        this.showNotification('Failed to submit timesheet. Please try again.', 'danger');
        this.isSaving = false;
      }
    });

    // Here you would typically call your service to submit the data
    // this.resourceTimesheetService.submitTimeSheetData(timeSheetPayload).subscribe(
    //   response => {
    //     console.log('Timesheet submitted successfully:', response);
    //     this.showNotification('Timesheet submitted successfully!', 'success');
    //   },
    //   error => {
    //     console.error('Error submitting timesheet:', error);
    //     this.showNotification('Failed to submit timesheet. Please try again.', 'danger');
    //   }
    // );

    this.showNotification('Timesheet submitted successfully!', 'success');
  }

  normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Fix UTC shift
    return d;
  }


  showNotification(message: string, type: 'success' | 'danger') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => this.clearNotification(), 5000); // Increased timeout for better UX
  }

  clearNotification() {
    this.notification = '';
    this.notificationType = '';
  }

  private setupAutoSaveOnUnload() {
    // Auto-save on page unload/refresh
    window.addEventListener('beforeunload', (event) => {
      this.autoSaveAllPendingChanges();
    });

    // Auto-save when user navigates away (for SPA routing)
    window.addEventListener('pagehide', (event) => {
      this.autoSaveAllPendingChanges();
    });
  }

  private autoSaveAllPendingChanges() {
    // Auto-save all days that have unsaved changes
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      if (this.hasUnsavedChanges.get(dayIdx)) {
        this.autoSaveDay(dayIdx);
      }
    }
  }

  // Enhanced leave methods with auto-save
  markAllLeaveAndAutoSave(dayIdx: number) {
    console.log(`Auto-save wrapper: markAllLeaveAndAutoSave called for day ${dayIdx}`);
    
    // Execute the original leave logic
    this.markAllLeave(dayIdx);
    
    // Always mark day as having unsaved changes and trigger auto-save
    // This works for both applying AND removing leave
    this.hasUnsavedChanges.set(dayIdx, true);
    console.log(`Day ${dayIdx} marked as having unsaved changes, triggering auto-save...`);
    
    setTimeout(() => {
      console.log(`Executing auto-save for day ${dayIdx}`);
      this.autoSaveDay(dayIdx);
    }, 150); // Slightly longer delay to ensure UI updates complete
  }

  markProjectLeaveAndAutoSave(projectCode: string, dayIdx: number) {
    console.log(`Auto-save wrapper: markProjectLeaveAndAutoSave called for ${projectCode} on day ${dayIdx}`);
    
    // Execute the original leave logic
    this.markProjectLeave(projectCode, dayIdx);
    
    // Always mark day as having unsaved changes and trigger auto-save
    // This works for both applying AND removing leave
    this.hasUnsavedChanges.set(dayIdx, true);
    console.log(`Day ${dayIdx} marked as having unsaved changes, triggering auto-save...`);
    
    setTimeout(() => {
      console.log(`Executing auto-save for day ${dayIdx} after ${projectCode} leave change`);
      this.autoSaveDay(dayIdx);
    }, 150); // Slightly longer delay to ensure UI updates complete
  }

  // Click outside functionality
  private setupClickOutsideHandler() {
    document.addEventListener('click', this.clickOutsideHandler);
  }

  private removeClickOutsideHandler() {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  private handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check if click is outside dropdown and dropdown button
    if (!target.closest('.leave-button-wrapper') && this.dayDropdownOpen !== null) {
      this.dayDropdownOpen = null;
    }
  }
}
