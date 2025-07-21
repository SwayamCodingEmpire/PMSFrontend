import { ProjectTimeSheet } from "./ProjectTimeSheet";

export interface TimeSheetFetchPayload {
  projectCode: string; // Unique identifier for the resource allocation
  projectName: string;
  projectTimeSheet: ProjectTimeSheet[]; // Array of project time sheets
}
