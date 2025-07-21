import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectBasicModel } from '../../models/ProjectBasicModel';

@Injectable({
  providedIn: 'root'
})
export class ProjectTransferService {


   private projectSubject = new BehaviorSubject<ProjectBasicModel | null>(null);
  project$ = this.projectSubject.asObservable();

  setProject(project: ProjectBasicModel) {
    this.projectSubject.next(project);
  }

  getProject(): ProjectBasicModel | null {
  const stored = localStorage.getItem('project');
  return stored ? JSON.parse(stored) : null;
}
}
