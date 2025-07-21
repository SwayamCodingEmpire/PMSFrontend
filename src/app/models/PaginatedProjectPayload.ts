import { ProjectDetailsPayload } from "./ProjectDetailsPayload ";

export interface PaginatedProjectsResponse {
  content: ProjectDetailsPayload[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
