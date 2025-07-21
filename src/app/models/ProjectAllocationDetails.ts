export interface ProjectAllocationDetails {
  projectCode: string;
  projectName: string;
  from: string; // ISO date string (e.g., '2024-07-01')
  to: string;
  role: string;
  billability: number;
  plannedUtil: number;
  actualUtil: number;
}
