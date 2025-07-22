import { ProjectAllocation } from "./ProjectAllocation";
import { SkillDTO } from "./SkillPayload";

export interface Employee {
  id: string;
  name: string;
  emailId: string;
  phoneNumber: string;
  primarySkill?: SkillDTO[];
  secondarySkill?: SkillDTO[];
  designation: string;
  experience: number;
  role: string; // e.g., "Developer", "Tester", etc.
  reportingManagerId?: string; // Optional field for reporting manager
  reportingManagerName?: string; // Optional field for reporting manager ID
  allocation: ProjectAllocation[];
}
