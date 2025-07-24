import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { SkillService } from '../../../services/manager/skill.service';
import { PublicService } from '../../../services/public/public.service';

interface SkillItem {
  id: number;
  skillName: string;
}
@Component({
  selector: 'app-skill-master',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './skill-master.component.html',
  styleUrl: './skill-master.component.scss'
})
export class SkillMasterComponent implements OnInit {
  skills: SkillItem[] = [];
  pagedSkills: SkillItem[] = [];
  form: FormGroup;
 
  editMode = false;
  editId: number | null = null;
  currentPage = 1;
  pageSize = 5;
  saving = false;
  loading = false;
 
  constructor(
    private fb: FormBuilder,
    private publicService: PublicService,
    private skillService: SkillService
  ) {
    this.form = this.fb.group({
      skillName: ['', Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.loadSkills();
  }
 
  loadSkills(): void {
    this.loading = true;
      this.publicService.getAllSkills().subscribe({
      next: (data: string[]) => {
        // Convert string array to SkillItem array with auto-generated IDs
        this.skills = data.map((skillName, index) => ({
          id: index + 1,
          skillName: skillName
        })).sort((a, b) => a.skillName.localeCompare(b.skillName));
       
        this.setPage(1);
        this.loading = false;
      },
      error: err => {
        console.error('Error loading skills:', err);
        this.loading = false;
      }
    });
  }
 
  onSubmit(): void {
    if (this.form.invalid) return;
 
    this.saving = true;
    const skillName = this.form.value.skillName;
    console.log('Form Submitted:', { skillName });
 
    if (this.editMode && this.editId !== null) {
      // Find the original skill name
      const originalSkill = this.skills.find(s => s.id === this.editId);
      if (originalSkill) {
        this.skillService.updateSkill(originalSkill.skillName, skillName).subscribe({
          next: () => {
            this.resetForm();
            this.loadSkills();
            this.saving = false;
          },
          error: err => {
            console.error('Error updating skill:', err);
            this.saving = false;
          }
        });
      }
    } else {
      this.skillService.addSkill(skillName).subscribe({
        next: () => {
          this.resetForm();
          this.loadSkills();
          this.saving = false;
        },
        error: err => {
          console.error('Error adding skill:', err);
          this.saving = false;
        }
      });
    }
  }
 
  onEdit(skill: SkillItem): void {
    this.editMode = true;
    this.editId = skill.id;
    this.form.patchValue({
      skillName: skill.skillName
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  cancelEdit(): void {
    this.resetForm();
  }
 
  resetForm(): void {
    this.form.reset({ skillName: '' });
    this.editMode = false;
    this.editId = null;
  }
 
  setPage(page: number): void {
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSkills = this.skills.slice(start, end);
    this.currentPage = page;
  }
 
  get totalPages(): number {
    return Math.ceil(this.skills.length / this.pageSize);
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

}
