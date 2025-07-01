import { ProjectAllocation } from "./ProjectAllocation";

export interface Employee {
  id: number;
  name: string;
  primarySkill: string;
  secondarySkill: string;
  designation: string;
  experience: number;
  allocation: ProjectAllocation;
}
