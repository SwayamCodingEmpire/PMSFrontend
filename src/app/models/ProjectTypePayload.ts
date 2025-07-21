export interface ProjectTypePayload {
  projectType: number; // e.g., "Internal", "Client", etc.
  customerProject: boolean; // indicates if the project is for a customer
}
