export interface ResourceEditPayload {
  id: string;
  primarySkill?: string;
  secondarySkill?: string; // Optional since no Validators.required
  role?: string; // Optional since no Validators.required
}
