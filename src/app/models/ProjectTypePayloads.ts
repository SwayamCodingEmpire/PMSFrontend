export interface ProjectTypeOption {
  id: number;
  value: string;
  label: string;
}

export interface ProjectTypeDropdownGroup {
  isCustomerType: boolean;
  options: ProjectTypeOption[];
}
