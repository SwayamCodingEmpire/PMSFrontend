import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ProjectTypeService } from '../../../services/manager/project-type.service';
import { ProjectTypeDTO } from '../../../models/ProjectTypeDTO';


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
  pageSize = 10;
  saving = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private projectTypeService: ProjectTypeService
  ) {
    this.form = this.fb.group({
      projectType: ['', Validators.required],
      customer: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProjectTypes();
  }

  loadProjectTypes(): void {
    this.loading = true;
    this.projectTypeService.getAll().subscribe({
      next: data => {
        this.projectTypes = data.sort((a, b) => a.projectType.localeCompare(b.projectType));
        this.setPage(1);
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

    this.saving = true;
    const payload = this.form.value;
    const request$ = this.editMode && this.editId !== null
      ? this.projectTypeService.update({ id: this.editId, ...payload })
      : this.projectTypeService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadProjectTypes();
        this.saving = false;
      },
      error: err => {
        console.error('Error saving:', err);
        this.saving = false;
      }
    });
  }

  onEdit(project: ProjectTypeDTO): void {
    this.editMode = true;
    this.editId = project.id;
    this.form.patchValue({
      projectType: project.projectType,
      customer: !!project.customer
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
  }

  setPage(page: number): void {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProjectTypes = this.projectTypes.slice(start, end);
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.projectTypes.length / this.pageSize);
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
    this.setPage(1);
  }

  toggleCustomer(): void {
    const control = this.form.get('customer');
    control?.setValue(!control?.value);
  }
}
