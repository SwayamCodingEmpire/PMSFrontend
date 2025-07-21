import { SkillDTO } from "./SkillPayload";

export interface ProjectResourceAllocationsPayload {
  empId: string;
  name: string;
  primarySkill: SkillDTO[];
  secondarySkill: SkillDTO[];
  designation: string;
  totalWorkingHoursDaily: number;     // BigDecimal → number
  totalDaysWorked: number;            // Long → number
  allocationStartDate: string;        // LocalDate → ISO string (e.g., "2024-07-10")
  allocationEndDate: string;
  actualAllocationEndDate: string;
  role: string;
  experience: number;                 // BigDecimal → number
  billability: number;
  plannedUtil: number;
  actualUtil: number;
}
