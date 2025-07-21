import { ResourceAllocations } from "./ResourceAllocations";

export interface PaginatedResourceAllocationPayload {
  content: ResourceAllocations[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
