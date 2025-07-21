import { PaginatedProjectResourceAllocationPayload } from "./PaginatedProjectResourceAllocationPayload";

export interface ProjectAllocationViewPayload {
  projectCode: string;
  projectName: string;
  customerName: string;
  resourceAllocations: PaginatedProjectResourceAllocationPayload;
}
