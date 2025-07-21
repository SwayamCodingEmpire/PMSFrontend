export interface ResourcesAllocated {
  id: string; // Unique identifier for the resource allocation
  start: string; // ISO date string (e.g., '2024-07-01')
  end: string;   // ISO date string
  role: string;
  billability: number;
  plannedHours: number;
}
