import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ProjectTypeService } from '../../../services/manager/project-type.service';
import { ProjectTypeDTO } from '../../../models/ProjectTypeDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-type-master',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './project-type-master.component.html',
  styleUrls: ['./project-type-master.component.scss'],
  providers: [ProjectTypeService]
})
export class ProjectTypeMasterComponent implements OnInit {
  projectTypes: ProjectTypeDTO[] = [];
  pagedProjectTypes: ProjectTypeDTO[] = [];
  form: FormGroup;

  editMode = false;
  editId: number | null = null;
  currentPage = 1;
  pageSize = 5;
  saving = false;
  loading = false;
  formVisible = false;

  constructor(
    private fb: FormBuilder,
    private projectTypeService: ProjectTypeService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      projectType: ['', Validators.required],
      isCustomerProject: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjectTypes();
  }

  loadProjectTypes(): void {
    this.loading = true;
    this.projectTypeService.getAll().subscribe({
      next: data => {
        this.projectTypes = data.sort((a, b) => a.id - b.id); // sort ascending
        this.updatePagination(); // handles current page after data change
        this.loading = false;
      },
      error: err => {
        console.error('Error loading project types:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value;
    const isEditMode = this.editMode;

    // Prevent duplicate projectType (case-insensitive)
    const isDuplicate = this.projectTypes.some(type =>
      type.projectType.trim().toLowerCase() === payload.projectType.trim().toLowerCase() &&
      (!isEditMode || (isEditMode && type.id !== this.editId)) // Allow if editing the same one
    );

    if (isDuplicate) {
      this.toastr.error('Project type name already exists!');
      return;
    }

    this.saving = true;

    const request$ = isEditMode && this.editId !== null
      ? this.projectTypeService.update({ id: this.editId, ...payload })
      : this.projectTypeService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.toastr.success(isEditMode ? 'Project type updated successfully!' : 'Project type added successfully!');

        this.projectTypeService.getAll().subscribe({
          next: data => {
            this.projectTypes = data.sort((a, b) => a.id - b.id);

            if (isEditMode) {
              this.setPage(this.currentPage);
            } else {
              const lastPage = Math.ceil(this.projectTypes.length / this.pageSize);
              this.setPage(lastPage);
            }
          },
          error: err => {
            console.error('Error loading project types after submit:', err);
          },
          complete: () => {
            this.saving = false;
          }
        });
      },
      error: err => {
        console.error('Error saving:', err);
        this.toastr.error('Something went wrong. Please try again.');
        this.saving = false;
      }
    });
  }

  onEdit(project: ProjectTypeDTO): void {
    this.editMode = true;
    this.editId = project.id;
    this.formVisible = true;
    this.form.patchValue({
      projectType: project.projectType,
      isCustomerProject: !!project.customer
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset({ projectType: '', customer: false });
    this.editMode = false;
    this.editId = null;
    this.formVisible = false;
  }

  setPage(page: number): void {
    console.log('Setting page:', page, 'with pageSize:', this.pageSize);

    const totalPages = this.totalPages;
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedProjectTypes = this.projectTypes.slice(start, end);
    this.currentPage = page;

    console.log('Start:', start, 'End:', end, 'Total:', this.projectTypes.length);
  }


  get totalPages(): number {
    return Math.ceil(this.projectTypes.length / this.pageSize) || 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  goToFirstPage(): void {
    this.setPage(1);
  }

  goToLastPage(): void {
    this.setPage(this.totalPages);
  }

  onPageSizeChange(): void {
    // Wait for pageSize to bind via ngModel, then apply valid pagination
    setTimeout(() => {
      const totalPages = this.totalPages;
      const validPage = Math.min(this.currentPage, totalPages);
      this.setPage(validPage || 1);
    }, 0);
  }

  updatePagination(): void {
    const totalPages = this.totalPages;
    const validPage = Math.min(this.currentPage, totalPages);
    this.setPage(validPage || 1); // fallback to 1
  }

  showAddForm(): void {
    this.formVisible = true;
    this.editMode = false;
    this.editId = null;
    this.form.reset({ projectType: '', isCustomerProject: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

