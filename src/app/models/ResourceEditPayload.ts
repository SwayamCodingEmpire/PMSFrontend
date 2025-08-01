export interface ResourceEditPayload {
  id: string;
  primarySkill?: string;
  secondarySkill?: string; // Optional since no Validators.required
  role?: string;
  designation?: string; // Optional since no Validators.required
  experience?: number; // Optional since no Validators.required
  reportingManager: string; // Required field
  deliveryManager: string; // Optional since no Validators.required
}
