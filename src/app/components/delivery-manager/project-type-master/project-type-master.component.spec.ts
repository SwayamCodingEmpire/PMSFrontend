import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTypeMasterComponent } from './project-type-master.component';

describe('ProjectTypeMasterComponent', () => {
  let component: ProjectTypeMasterComponent;
  let fixture: ComponentFixture<ProjectTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTypeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
