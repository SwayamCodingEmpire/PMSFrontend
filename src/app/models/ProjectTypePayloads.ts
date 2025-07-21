export interface ProjectTypeOption {
  id: number;
  value: string;
  label: string;
}

export interface ProjectTypeDropdownGroup {
  label: string;
  options: ProjectTypeOption[];
}
