import { ResourcesAllocated } from "./ResourcesAllocated";

export interface AllocationPayload {
  projectCode: string; // Code of the project to which resources are allocated
  allocations: ResourcesAllocated[]; // Array of resource allocations
}
