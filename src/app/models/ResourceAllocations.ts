import { ProjectAllocationDetails } from "./ProjectAllocationDetails";
import { SkillDTO } from "./SkillPayload";

export interface ResourceAllocations {
  id: string;
  name: string;
  primarySkill: SkillDTO[];
  secondarySkill: SkillDTO[];
  designation: string;
  experience: number;
  currentAllocation: ProjectAllocationDetails[];
  billability: number;
  plannedUtil: number;
  actualUtil: number;
}
