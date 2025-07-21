import { CustomerPayload } from "./CustomerPayload";
import { ProjectTypePayload } from "./ProjectTypePayload";

export interface ProjectPayload {
  projectInfo: {
    code: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    currency: string;
    contractType: string;
    projectType: string;  // e.g., "Internal", "Client", etc.
    billingFrequency: string;
    isCustomerProject: boolean;  // indicates if the project is for a customer
  };
  projectType: ProjectTypePayload;
  customerInfo: CustomerPayload;  // includes `id`, `name`, `legalEntity`, `businessUnit`
  managerId: string;
}
