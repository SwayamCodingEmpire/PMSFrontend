import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/Employee';
import { ProjectAllocation } from '../../../models/ProjectAllocation';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ResourceService, SkillUpsertDTO } from '../../../services/manager/resource.service';
import { ReportingManagerPayload } from '../../../models/ReportingManagerPayload';
import { UsersService } from '../../../services/manager/users.service';
import { PaginatedResourcesPayload } from '../../../models/PaginatedResources';
import { ResourceEditPayload } from '../../../models/ResourceEditPayload';
import { SkillDTO } from '../../../models/SkillPayload';
import { PublicService } from '../../../services/public/public.service';
import { ResourceAllocationService } from '../../../services/manager/resource-allocation.service';
declare const bootstrap: any;

interface Skill {
  id: number;
  name: string;
  experience: number;
  level: string;
  isPrimary: boolean;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent implements OnInit {
  isCreatingNewSkill: boolean = false;
  newSkillName: string = '';
  role: string = '';
  isNewSkill: boolean = false;
  isPrimary: boolean = true;
  private deleteModal: any;
  private projectModal: any;
  private addModal: any;
  private skillsModal: any
  editingEmployeeId: string | null = null;
  editingData: { primarySkill: string; secondarySkill: string } = { primarySkill: '', secondarySkill: '' };
  currentEmployeeSkills: SkillDTO[] = [];
  editingSkillId: string | null = null;
  editingSkillData: { name: string; experience: number; level: string } = { name: '', experience: 0, level: '' };
  skillNames = ['Java', 'Angular', 'React', 'Python', 'Node.js', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'Kubernetes'];
  skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  loadSkillNames(): void {
    this.publicService.getAllSkills().subscribe({
      next: (skills) => {
        this.skillNames = skills;
      },
      error: (err) => {
        console.error('Error loading skills:', err);
      }
    });
  }

  // --- Open Modal and Load Static Data ---
  openSkillsModal(emp: Employee, isPrimary: boolean): void {
    this.selectedEmployee = { ...emp };
    this.loadEmployeeSkills(emp.id);
    this.isPrimary = isPrimary;
    console.log('Opening skills modal for employee:', emp.name, 'Primary:', isPrimary);
    setTimeout(() => {
      const modalEl = document.getElementById('skillsModal');
      if (modalEl) {
        this.skillsModal = new (window as any).bootstrap.Modal(modalEl);
        this.skillsModal.show();

        if (isPrimary) {
          this.currentEmployeeSkills = (emp.primarySkill ?? []).map(skill => ({
            skillName: skill.skillName,
            skillExperience: skill.skillExperience,
            level: skill.level
          }));
        } else {
          this.currentEmployeeSkills = (emp.secondarySkill ?? []).map(skill => ({
            skillName: skill.skillName,
            skillExperience: skill.skillExperience,
            level: skill.level
          }));
        }
      }
    }, 0);
  }


  loadEmployeeSkills(empId: string): void {
    // Static data for now - in real implementation, this would come from API
    // this.currentEmployeeSkills = [
    //   { id: 1, name: 'Java', experience: 3, level: 'Advanced', isPrimary: true },
    //   { id: 2, name: 'Angular', experience: 2, level: 'Medium', isPrimary: true },
    //   { id: 3, name: 'MySQL', experience: 2, level: 'Basic', isPrimary: false },
    //   { id: 4, name: 'Python', experience: 1, level: 'Basic', isPrimary: false }
    // ];
  }
  // loadEmployeeSkills(empId: number): void {
  //   // Static data for now - in real implementation, this would come from API
  //   this.currentEmployeeSkills = [
  //     { id: 1, name: 'Java', experience: 3, level: 'Advanced', isPrimary: true },
  //     { id: 2, name: 'Angular', experience: 2, level: 'Medium', isPrimary: true },
  //     { id: 3, name: 'MySQL', experience: 2, level: 'Basic', isPrimary: false },
  //     { id: 4, name: 'Python', experience: 1, level: 'Basic', isPrimary: false }
  //   ];
  // }
  editSkill(skill: SkillDTO): void {
    this.isNewSkill = false;
    this.editingSkillId = skill.skillName;
    this.editingSkillData = {
      name: skill.skillName,
      experience: skill.skillExperience,
      level: skill.level
    };
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    const toastEl = document.getElementById('errorToast');
    if (toastEl) {
      const toast = new (window as any).bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  saveSkill(skill: SkillDTO): void {
    if (!this.editingSkillData.name || this.editingSkillData.experience <= 0) {
      this.showErrorToast('Please fill all required fields');
      return;
    }

    const isDuplicate = this.currentEmployeeSkills.some(s =>
      s.skillName === this.editingSkillData.name &&
      s.skillName !== skill.skillName // only if editing
    );

    if (!this.isNewSkill && isDuplicate) {
      this.showErrorToast('Skill with this name already exists');
      return;
    }

    const upsertData: SkillUpsertDTO = {
      experience: this.editingSkillData.experience,
      skillLevel: this.editingSkillData.level,
      skillPriority: this.isPrimary ? 'PRIMARY' : 'SECONDARY'
    };



    const empId = this.selectedEmployee.id;

    if (this.isNewSkill) {
      // Call ADD
      this.resourceService.addSkillForResource(empId, upsertData, this.editingSkillData.name).subscribe({
        next: (response) => {
          console.log('Skill added successfully:', response);
          this.cancelSkillEdit();
          this.skillsModal.hide();
          this.loadResources();
          this.showSuccessToast('Skill added successfully');
        },
        error: (error) => {
          console.error('Error adding skill:', error);
          this.showErrorToast('Error adding skill');
          this.cancelSkillEdit();
        }
      });
    } else {
      // Call UPDATE
      this.resourceService.updateSkillForResource(empId, upsertData, skill.skillName).subscribe({
        next: (response) => {
          console.log('Skill updated successfully:', response);
          this.cancelSkillEdit();
          this.loadResources();
          this.showSuccessToast('Skill updated successfully');
        },
        error: (error) => {
          console.error('Error updating skill:', error);
          this.showErrorToast('Error updating skill');
          this.cancelSkillEdit();
        }
      });
    }
  }


  cancelSkillEdit(): void {
    this.editingSkillId = null;
    this.editingSkillData = { name: '', experience: 0, level: '' };
  }

  copiedItem: string | null = null;
  copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    this.copiedItem = text;

    setTimeout(() => {
      this.copiedItem = null;
    }, 1500);
  }).catch(err => {
    console.error(`Copy failed for ${label}:`, err);
  });
}


  isEditingSkill(skillId: string): boolean {
    return this.editingSkillId === skillId;
  }

  deleteSkill(skillName: string): void {
    this.currentEmployeeSkills = this.currentEmployeeSkills.filter(s => s.skillName !== skillName);
    this.resourceService.deleteSkillForResource(this.selectedEmployee.id, skillName).subscribe({
      next: (response) => {
        console.log('Skill deleted successfully:', response);
        this.loadResources();
        this.showSuccessToast('Skill deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting skill:', error);
        this.showErrorToast('Error deleting skill');
      }
    });
  }

  addNewSkill(): void {
    const tempId = 'new_' + Date.now(); // Unique ID for temporary editing state
    const newSkill: SkillDTO = {
      skillName: tempId, // temporarily set a unique skillName
      skillExperience: 0,
      level: 'Beginner'
    };
    this.isNewSkill = true;
    this.editingSkillId = tempId; // match with temporary ID
    this.editingSkillData = {
      name: '',
      experience: 0,
      level: 'Beginner'
    };
    this.currentEmployeeSkills.push(newSkill);
  }




  // --- Save All Skills to Main Form (on modal close) ---
  close(): void {
    if (this.skillsModal) {
      this.skillsModal.hide();
    }
  }
  editingIndex: number = -1;
  managerSearchText: string = '';
  employees: Employee[] = [];
  selectedEmployee: Employee = this.getEmptyEmployee();
  selectedProjects: ProjectAllocation[] = [];
  resourceForm: FormGroup;
  searchControl = new FormControl('');
  newEmployee: Employee = this.getEmptyEmployee();
  oldId: string = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalItems = 0;
  editForm: FormGroup;


  isEditing(empId: string): boolean {
    return this.editingEmployeeId === empId;
  }




  // Modal references
  // private deleteModal: any;
  // private projectModal: any;
  // private addModal: any;

  // Pagination variables
  paginatedEmployees: Employee[] = [];

  searchTerm: string = '';
  filteredEmployees: Employee[] = [];

  toastMessage: string = '';


  formatSkillArray(skills: SkillDTO[] | null): string {
    if (!skills || skills.length === 0) return '';
    return skills
      .map(skill => `${skill.skillName} (${skill.skillExperience}y, ${skill.level})`)
      .join(', ');
  }


  getPrimarySkills(employee: Employee): string {
    return (employee.primarySkill ?? []).map(skill => skill.skillName).join(', ');
  }

  getSecondarySkills(employee: Employee): string {
    return (employee.secondarySkill ?? []).map(skill => skill.skillName).join(', ');
  }


  constructor(private fb: FormBuilder, private resourceService: ResourceService, private usersService: UsersService, private publicService: PublicService, private reesourceAllocation: ResourceAllocationService) {
        this.resourceForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      emailId: ['', [Validators.required, Validators.email]],

      phoneNumber: ['', [Validators.required, Validators.pattern('^(\\+91[-\\s]?)?[6-9]\\d{9}$')]],
      designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      experience: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      role: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      reportingManager: ['', Validators.required]
    });
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      primarySkill: ['', Validators.required],
      secondarySkill: [''],
      role: ['', Validators.required],
    });

  }



  Math = Math;

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.loadSkillNames();
    this.loadRMs();
    this.loadResources();
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term ?? '';
        this.applySearch();
      });
  }
  isAllowedForDML(): boolean {
    return this.role === 'DELIVERY_MANAGER';
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  loadRMs() {
    this.usersService.getReportingManagers().subscribe({
      next: (data: ReportingManagerPayload[]) => {
        this.reportingManagers = data;
      },
      error: (error) => {
        console.error('Error loading reporting managers:', error);
      }
    });
  }




  // Pagination controls
  goToFirstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.loadResources();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadResources();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadResources();
    }
  }

  goToLastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.totalPages;
      this.loadResources();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadResources();
  }

  // Search
  applySearch(): void {
    this.currentPage = 1;
    this.loadResources();
  }

  editEmployee(i: number): void {
    const emp = this.employees[i];
    this.editingIndex = i;
    this.oldId = emp.id;
    this.selectedEmployee = { ...emp };
    this.editForm.patchValue(emp);
    this.resourceForm.get('reportingManager')?.setValue(emp.reportingManagerId || '');
  }

  cancelEdit(): void {
    this.editingIndex = -1;
    this.resourceForm.reset(this.getEmptyEmployee());
    this.selectedEmployee = this.getEmptyEmployee();
  }

  saveEmployee(): void {
    if (this.editForm.invalid) {
      return;
    }


    const updatedEmployee: ResourceEditPayload = this.editForm.value;

    console.log('Updated Employee Data:', updatedEmployee);

    if (this.editForm.valid) {
      this.resourceService.updateResource(updatedEmployee).subscribe({
        next: (response) => {
          this.editingIndex = -1; // Reset editing index after saving
          console.log('Resource updated successfully:', response);
          this.showSuccessToast('Resource details updated successfully');

          const modalEl = document.getElementById('editEmployeeModal');
          (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
          this.loadResources();
          this.loadManagers();
          this.applySearch();
          this.resourceForm.reset(this.getEmptyEmployee());
        }
        ,
        error: (error) => {
          console.error('Error updating resource:', error);
          this.showSuccessToast('Error updating resource details');
        }
      });
    }



  }



  openDeleteModal(emp: Employee): void {
    this.selectedEmployee = { ...emp };
    setTimeout(() => {
      const modalEl = document.getElementById('deleteConfirmationModal');
      if (modalEl) {
        this.deleteModal = new (window as any).bootstrap.Modal(modalEl);
        this.deleteModal.show();
      }
    }, 0);
  }

  confirmDelete(): void {
    this.employees = this.employees.filter(e => e.id !== this.selectedEmployee.id);
    this.selectedEmployee = this.getEmptyEmployee();

    this.applySearch();

    if (this.deleteModal) {
      this.deleteModal.hide();
    }

    this.showSuccessToast('Resource deleted successfully');
  }

  getTotalProjects(allocations: ProjectAllocation[]): number {
    return allocations.length;
  }

  viewProjectDetails(emp: Employee): void {
    this.selectedEmployee = { ...emp };
    this.selectedProjects = emp.allocation;
    setTimeout(() => {
      const modalEl = document.getElementById('projectDetailsModal');
      if (modalEl) {
        this.projectModal = new (window as any).bootstrap.Modal(modalEl);
        this.projectModal.show();
      }
    }, 0);
  }

  private getEmptyEmployee(): Employee {
    return {
      id: '',
      name: '',
      emailId: '',
      phoneNumber: '',
      primarySkill: new Array<SkillDTO>(),
      secondarySkill: new Array<SkillDTO>(),
      designation: '',
      experience: 0,
      role: '',
      reportingManagerId: '',
      allocation: new Array<ProjectAllocation>(),
    };
  }

  loadResources() {
    const page = this.currentPage - 1;
    this.resourceService.getAllResources(page, this.pageSize, this.searchTerm).subscribe({
      next: (paginatedData: PaginatedResourcesPayload) => {
        console.log('Paginated Data:', paginatedData);
        this.employees = paginatedData.content || [];
        this.totalPages = paginatedData.totalPages || 1;
        this.totalItems = paginatedData.totalElements || 0;
        console.log('Resources loaded:', this.employees);
      },
      error: (error) => {
        console.error('Error loading resources:', error);
        this.employees = []; // Ensure employees is always an array even on error
      }
    });


  }

  showSuccessToast(message: string): void {
    this.toastMessage = message;
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toast = new (window as any).bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  openAddModal(): void {
    this.resourceForm.reset(this.getEmptyEmployee());
    setTimeout(() => {
      const modalEl = document.getElementById('addEmployeeModal');
      if (modalEl) {
        this.addModal = new (window as any).bootstrap.Modal(modalEl);
        this.addModal.show();
      }
    }, 0);
  }


  // saveNewEmployee(): void {


  //   if (this.resourceForm.valid) {

  //     console.log('New Employee:', this.resourceForm.value);
  //     const newEmployeeData: Employee = {
  //       id: this.resourceForm.get('id')?.value || '',
  //       name: this.resourceForm.get('name')?.value,
  //       emailId: this.resourceForm.get('emailId')?.value,
  //       phoneNumber: this.resourceForm.get('phoneNumber')?.value,
  //       primarySkill: this.resourceForm.get('primarySkill')?.value,
  //       secondarySkill: this.resourceForm.get('secondarySkill')?.value || '',
  //       designation: this.resourceForm.get('designation')?.value,
  //       experience: this.resourceForm.get('experience')?.value,
  //       role: this.resourceForm.get('role')?.value,
  //       reportingManagerId: this.resourceForm.get('reportingManager')?.value || '',
  //       allocation: []
  //     };
  //     console.log('New Employee Data:', newEmployeeData);
  //     this.resourceService.createResource(newEmployeeData).subscribe({
  //       next: (response) => {
  //         console.log('New resource added successfully:', response);
  //         this.loadResources();
  //         this.loadManagers();
  //         this.applySearch();
  //         this.resourceForm.reset(this.getEmptyEmployee());
  //         this.showSuccessToast('New resource added successfully');
  //         this.addModal.hide();
  //       },
  //       error: (error) => {
  //         console.error('Error adding new resource:', error);
  //         this.showSuccessToast('Error adding new resource');
  //       }
  //     });
  //   }
  // }

  saveNewEmployee(): void {
    if (this.resourceForm.valid) {
      const form = this.resourceForm.value;

      // Minimal payload with NO primarySkill/secondarySkill
      const resourcePayload: Employee = {
        id: form.id,
        name: form.name,
        emailId: form.emailId,
        phoneNumber: form.phoneNumber,
        designation: form.designation,
        experience: form.experience,
        role: form.role,
        reportingManagerId: form.reportingManager,
        reportingManagerName: this.getReportingManagerName(form.reportingManager),
        allocation: [] // default empty allocation
      };

      console.log('Resource Payload Sent:', resourcePayload);

      this.resourceService.createResource(resourcePayload).subscribe({
        next: () => {
          this.showSuccessToast('New resource added successfully');
          this.currentPage = 1;
          this.searchTerm = '';
          this.loadResources();
          this.addModal.hide();
        },
        error: (err) => {
          console.error('Error adding resource:', err);
          this.showErrorToast('Failed to add resource: ' + err.error?.message);
        }
      });
    }
  }



  private getReportingManagerName(empId: string): string {
    const manager = this.reportingManagers.find(m => m.empId === empId);
    return manager?.name || '';
  }


  selectManager(id: string) {
    this.resourceForm.get('reportingManager')?.setValue(id);
  }


  reportingManagers: ReportingManagerPayload[] = [
    { empId: 'EMP1003', name: 'Manager 1', emailId: 'mdkf@email.com' },
    { empId: 'EMP1003', name: 'Manager 2', emailId: 'dkm@exkf.com' },
    { empId: 'EMP1003', name: 'Manager 3', emailId: 'kksmf@exskdple.com' },
    { empId: 'EMP1003', name: 'Manager 4', emailId: 'sfnsj@ksfk.com' }
  ];



  loadManagers() {

  }

  get filteredManagers() {
    const search = this.managerSearchText.toLowerCase();
    return this.reportingManagers.filter(m =>
      m.name.toLowerCase().includes(search) ||
      m.emailId.toLowerCase().includes(search)
    );
  }

  deallocateFromProject(project: ProjectAllocation) {
    console.log('Deallocating from project:', project);
    console.log('Selected Employee before deallocation:', this.selectedEmployee);
    this.reesourceAllocation.deleteAllocation(project.projectCode, this.selectedEmployee.id).subscribe({
      next: (response) => {
        console.log('Deallocation successful:', response);
        this.selectedEmployee.allocation = this.selectedEmployee.allocation.filter(a => a.projectCode !== project.projectCode);
        this.showSuccessToast('Successfully deallocated from project');
        this.loadResources();
        this.projectModal.hide();
      },
      error: (error) => {
        console.error('Error during deallocation:', error);
        this.showErrorToast('Failed to deallocate from project');
      }
    });

  }

  openNewSkillInput(): void {
    this.isCreatingNewSkill = true;
    this.newSkillName = '';
  }


}
