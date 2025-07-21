export interface TimesheetApprovalPayload {
  resourceId: string;
  projectId: string;
  startDate: Date; // Use `Date` if working with actual Date objects
  endDate: Date;   // Use `Date` if working with actual Date objects
  approve: boolean;
}
