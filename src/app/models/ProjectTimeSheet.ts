export interface ProjectTimeSheet {
  date: Date;
  approvalStatus: string | null; // 'Approved', 'Rejected', or null
  attendanceStatus: boolean;
  hoursWorked: number ;
}
