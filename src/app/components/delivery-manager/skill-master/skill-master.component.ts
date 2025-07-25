import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { SkillService } from '../../../services/manager/skill.service';
import { PublicService } from '../../../services/public/public.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

interface SkillItem {
  id: number;
  skillName: string;
}

@Component({
  selector: 'app-skill-master',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './skill-master.component.html',
  styleUrls: ['./skill-master.component.scss']
})
export class SkillMasterComponent implements OnInit, AfterViewInit {
  skills: SkillItem[] = [];
  pagedSkills: SkillItem[] = [];
  form: FormGroup;

  editMode = false;
  editId: number | null = null;
  currentPage = 1;
  pageSize = 5;
  saving = false;
  loading = false;
  formVisible = false;

  skillToDelete: SkillItem | null = null;
  private deleteModal: Modal | null = null;

  constructor(
    private fb: FormBuilder,
    private publicService: PublicService,
    private skillService: SkillService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      skillName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSkills();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('deleteSkillModal');
    if (modalElement) {
      this.deleteModal = new Modal(modalElement);
    }
  }

  promptDelete(skill: SkillItem): void {
    this.skillToDelete = skill;
    this.deleteModal?.show();
  }

  confirmDelete(): void {
    if (!this.skillToDelete) return;

    this.skillService.deleteSkill(this.skillToDelete.skillName).subscribe({
      next: () => {
        this.toastr.success('Skill deleted successfully');
        this.loadSkills(); // will reset page to 1
        this.skillToDelete = null;
        this.deleteModal?.hide();
      },
      error: err => {
        console.error('Error deleting skill:', err);
        this.toastr.error('Failed to delete skill');
        this.deleteModal?.hide();
      }
    });
  }

  loadSkills(): void {
    this.loading = true;
    this.publicService.getAllSkills().subscribe({
      next: (data: string[]) => {
        // this.skills = [...new Set(data.map(name => name.trim().toUpperCase()))]
        //   .sort()
        //   .map((skillName, index) => ({ id: index + 1, skillName }));

        const cleanedSkills = [...new Set(data.map(name => name.trim().toUpperCase()))].sort();
        this.skills = cleanedSkills.map((skillName, index) => ({ id: index + 1, skillName })); // fresh copy

        this.currentPage = 1;
        this.updatePagination();
        this.loading = false;
      },
      error: err => {
        console.error('Error loading skills:', err);
        this.toastr.error('Failed to load skills');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const skillName = this.form.value.skillName.toUpperCase();
    const duplicate = this.skills.some(s => s.skillName.toUpperCase() === skillName);

    if (!this.editMode && duplicate) {
      this.toastr.warning('Skill already exists');
      this.saving = false;
      return;
    }

    this.saving = true;

    if (this.editMode && this.editId !== null) {
      const originalSkill = this.skills.find(s => s.id === this.editId);
      if (originalSkill) {
        this.skillService.updateSkill(originalSkill.skillName, skillName).subscribe({
          next: () => {
            this.toastr.success('Skill updated successfully');
            this.resetForm();

            this.publicService.getAllSkills().subscribe({
              next: (data: string[]) => {
                // this.skills = [...new Set(data.map(name => name.trim().toUpperCase()))]
                //   .sort()
                //   .map((skillName, index) => ({ id: index + 1, skillName }));

                const cleanedSkills = [...new Set(data.map(name => name.trim().toUpperCase()))].sort();
                this.skills = cleanedSkills.map((skillName, index) => ({ id: index + 1, skillName })); // fresh copy

                this.currentPage = 1;
                this.updatePagination();
              },
              complete: () => (this.saving = false),
              error: () => {
                this.toastr.error('Failed to reload skills after update');
                this.saving = false;
              }
            });
          },
          error: err => {
            console.error('Error updating skill:', err);
            this.toastr.error('Failed to update skill');
            this.saving = false;
          }
        });
      }
    } else {
      this.skillService.addSkill(skillName).subscribe({
        next: () => {
          this.toastr.success('Skill added successfully');
          this.resetForm();

          this.publicService.getAllSkills().subscribe({
            next: (data: string[]) => {
              // this.skills = [...new Set(data.map(name => name.trim().toUpperCase()))]
              //   .sort()
              //   .map((skillName, index) => ({ id: index + 1, skillName }));

              const cleanedSkills = [...new Set(data.map(name => name.trim().toUpperCase()))].sort();
              this.skills = cleanedSkills.map((skillName, index) => ({ id: index + 1, skillName })); // fresh copy

              this.currentPage = 1;
              this.updatePagination();
            },
            complete: () => (this.saving = false),
            error: () => {
              this.toastr.error('Failed to reload skills after add');
              this.saving = false;
            }
          });
        },
        error: err => {
          console.error('Error adding skill:', err);
          this.toastr.error('Failed to add skill');
          this.saving = false;
        }
      });
    }
  }

  onEdit(skill: SkillItem): void {
    this.editMode = true;
    this.editId = skill.id;
    this.formVisible = true;
    this.form.patchValue({ skillName: skill.skillName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.form.reset({ skillName: '' });
    this.editMode = false;
    this.editId = null;
    this.formVisible = false;
  }

  showAddForm(): void {
    this.formVisible = true;
    this.editMode = false;
    this.editId = null;
    this.form.reset({ skillName: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setPage(page: number): void {
    const totalPages = this.totalPages;
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedSkills = this.skills.slice(start, end);
    this.currentPage = page;

    console.log(`SET PAGE: ${page}, PageSize: ${this.pageSize}, Total Skills: ${this.skills.length}, Showing: ${this.pagedSkills.length}`);

    if (this.skills.length < this.totalPages * this.pageSize) {
      console.warn('Skills array seems to be shrinking unexpectedly!', this.skills.length);
    }

  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.skills.length / this.pageSize));
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
    setTimeout(() => {
      this.currentPage = 1;
      this.updatePagination();
    }, 0);
  }

  updatePagination(): void {
    this.setPage(this.currentPage);
  }
}
