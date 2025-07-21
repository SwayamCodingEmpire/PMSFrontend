export interface ProjectDetailsPayload {
  projectCode: string;
  projectName: string;
  customerName: string;
  currency: string;
  scheduleStartDate: Date;
  scheduleEndDate: Date;
  projectManager: string;
  projectType: string; // e.g., "Internal", "Client", etc.
}
