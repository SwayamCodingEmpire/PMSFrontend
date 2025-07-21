import { Employee } from "./Employee";


export interface PaginatedResourcesPayload {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
