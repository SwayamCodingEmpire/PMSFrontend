import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/Employee';
import { ProjectAllocation } from '../../../models/ProjectAllocation';

@Component({
  selector: 'app-resources',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent implements OnInit {
  employees: Employee[] = [
    {
      id: 101,
      name: 'Rajesh Kumar',
      primarySkill: 'Angular',
      secondarySkill: 'Node.js',
      designation: 'Senior Developer',
      experience: 6,
      allocation: {
        projectName: 'Project Falcon',
        description: 'Inventory tracking module for retail clients.',
        startDate: '2023-05-01',
        endDate: '2024-05-01',
        projectManager: 'Suman Verma',
      },
    },
    {
      id: 102,
      name: 'Priya Sharma',
      primarySkill: 'Java',
      secondarySkill: 'Spring Boot',
      designation: 'Backend Engineer',
      experience: 4,
      allocation: {
        projectName: 'Project Orion',
        description: 'Customer sentiment analytics system.',
        startDate: '2024-01-10',
        endDate: '2025-01-10',
        projectManager: 'Anil Mehta',
      },
    },
    {
      id: 103,
      name: 'Aman Singh',
      primarySkill: 'React',
      secondarySkill: 'Redux',
      designation: 'Frontend Developer',
      experience: 3,
      allocation: {
        projectName: 'Project Gemini',
        description: 'Social media feed optimization.',
        startDate: '2023-09-01',
        endDate: '2024-09-01',
        projectManager: 'Neha Batra',
      },
    },
    {
      id: 104,
      name: 'Sneha Rathi',
      primarySkill: 'Python',
      secondarySkill: 'Django',
      designation: 'Full Stack Developer',
      experience: 5,
      allocation: {
        projectName: 'Project Apollo',
        description: 'E-learning content delivery platform.',
        startDate: '2022-06-15',
        endDate: '2023-06-15',
        projectManager: 'Vikas Malhotra',
      },
    },
    {
      id: 105,
      name: 'Aditya Rao',
      primarySkill: 'DevOps',
      secondarySkill: 'AWS',
      designation: 'DevOps Engineer',
      experience: 4,
      allocation: {
        projectName: 'InfraGuard',
        description: 'CI/CD automation for microservices.',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        projectManager: 'Sonal Dube',
      },
    },
    {
      id: 106,
      name: 'Kriti Mehra',
      primarySkill: 'UI/UX Design',
      secondarySkill: 'Figma',
      designation: 'Designer',
      experience: 2,
      allocation: {
        projectName: 'Visual Edge',
        description: 'Branding and UI overhaul for mobile apps.',
        startDate: '2023-08-01',
        endDate: '2024-08-01',
        projectManager: 'Tarun Grover',
      },
    },
    {
      id: 107,
      name: 'Ishaan Chawla',
      primarySkill: 'C#',
      secondarySkill: '.NET Core',
      designation: 'Software Engineer',
      experience: 6,
      allocation: {
        projectName: 'SecurePay',
        description: 'Payment gateway and encryption module.',
        startDate: '2024-02-10',
        endDate: '2025-02-10',
        projectManager: 'Alka Reddy',
      },
    },
    {
      id: 108,
      name: 'Nisha Tyagi',
      primarySkill: 'SQL',
      secondarySkill: 'PL/SQL',
      designation: 'Database Developer',
      experience: 7,
      allocation: {
        projectName: 'DataCore',
        description: 'Data warehousing for financial audits.',
        startDate: '2023-11-01',
        endDate: '2024-11-01',
        projectManager: 'Mehul Vyas',
      },
    },
    {
      id: 109,
      name: 'Rohit Khanna',
      primarySkill: 'Kotlin',
      secondarySkill: 'Android',
      designation: 'Mobile Developer',
      experience: 3,
      allocation: {
        projectName: 'MobTrack',
        description: 'Android app for real-time delivery tracking.',
        startDate: '2024-04-01',
        endDate: '2025-04-01',
        projectManager: 'Geeta Sharma',
      },
    },
    {
      id: 110,
      name: 'Simran Kapoor',
      primarySkill: 'Vue.js',
      secondarySkill: 'JavaScript',
      designation: 'Frontend Developer',
      experience: 2,
      allocation: {
        projectName: 'SmartForm',
        description: 'Dynamic form builder for enterprise apps.',
        startDate: '2023-10-01',
        endDate: '2024-10-01',
        projectManager: 'Rajeev Sinha',
      },
    },
    {
      id: 111,
      name: 'Abhay Jain',
      primarySkill: 'GoLang',
      secondarySkill: 'Microservices',
      designation: 'Backend Developer',
      experience: 5,
      allocation: {
        projectName: 'CloudMesh',
        description: 'Cloud-native backend services for IOT apps.',
        startDate: '2023-12-01',
        endDate: '2024-12-01',
        projectManager: 'Smriti Bajaj',
      },
    },
    {
      id: 112,
      name: 'Divya Rana',
      primarySkill: 'Testing',
      secondarySkill: 'Selenium',
      designation: 'QA Engineer',
      experience: 4,
      allocation: {
        projectName: 'QualityX',
        description: 'End-to-end automated testing framework.',
        startDate: '2023-07-01',
        endDate: '2024-07-01',
        projectManager: 'Nikhil Pandey',
      },
    },
  ];

  selectedEmployee: Employee = this.getEmptyEmployee();
  selectedProject: ProjectAllocation = this.getEmptyProject();

  // Modal references
  private deleteModal: any;
  private projectModal: any;

  // Pagination variables
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  paginatedEmployees: Employee[] = [];

  searchTerm: string = '';
  filteredEmployees: Employee[] = [];

  toastMessage: string = '';

  newEmployee: Employee = this.getEmptyEmployee();
  private addModal: any;


  ngOnInit(): void {
    this.filteredEmployees = [...this.employees]; // Initialize
    this.calculateTotalPages();
    this.updatePaginatedEmployees();
  }


  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
  }


  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEmployees();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEmployees();
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePaginatedEmployees();
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePaginatedEmployees();
  }

  editEmployee(emp: Employee): void {
    this.selectedEmployee = { ...emp };
    setTimeout(() => {
      const modalEl = document.getElementById('editEmployeeModal');
      if (modalEl) {
        const modal = new (window as any).bootstrap.Modal(modalEl);
        modal.show();
      }
    }, 0);
  }

  saveEmployee(): void {
    const index = this.employees.findIndex(e => e.id === this.selectedEmployee.id);
    if (index !== -1) {
      this.employees[index] = { ...this.selectedEmployee };
    }

    this.applySearch();

    const modalEl = document.getElementById('editEmployeeModal');
    (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();

    this.showSuccessToast('Resource details updated successfully');
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


  viewProjectDetails(emp: Employee): void {
    this.selectedProject = { ...emp.allocation };
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
      id: 0,
      name: '',
      primarySkill: '',
      secondarySkill: '',
      designation: '',
      experience: 0,
      allocation: this.getEmptyProject(),
    };
  }

  private getEmptyProject(): ProjectAllocation {
    return {
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      projectManager: '',
    };
  }

  applySearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredEmployees = [...this.employees]; // Reset
    } else {
      this.filteredEmployees = this.employees.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.primarySkill.toLowerCase().includes(term) ||
        emp.secondarySkill.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        emp.experience.toString().includes(term) ||
        emp.allocation?.projectName?.toLowerCase().includes(term) ||
        emp.allocation?.description?.toLowerCase().includes(term) ||
        emp.allocation?.projectManager?.toLowerCase().includes(term) ||
        emp.allocation?.startDate?.includes(term) ||
        emp.allocation?.endDate?.includes(term)
      );
    }

    this.currentPage = 1;
    this.updatePaginatedEmployees();
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
    this.newEmployee = this.getEmptyEmployee();
    setTimeout(() => {
      const modalEl = document.getElementById('addEmployeeModal');
      if (modalEl) {
        this.addModal = new (window as any).bootstrap.Modal(modalEl);
        this.addModal.show();
      }
    }, 0);
  }

  saveNewEmployee(): void {
    const newId = Math.max(...this.employees.map(e => e.id)) + 1;
    this.newEmployee.id = newId;
    this.employees.unshift({ ...this.newEmployee });

    if (this.addModal) {
      this.addModal.hide();
    }

    this.applySearch();
    this.showSuccessToast('New resource added successfully');
  }

}


