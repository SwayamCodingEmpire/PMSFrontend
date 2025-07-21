import { ProjectResourceAllocationsPayload } from "./ProjectResourceAllocationsPayload";

export interface PaginatedProjectResourceAllocationPayload {
  content: ProjectResourceAllocationsPayload[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
