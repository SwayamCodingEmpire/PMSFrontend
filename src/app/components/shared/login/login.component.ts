import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../services/login/login.service';
import { LoginCredentials } from '../../../models/LoginCredentials';
import { PublicService } from '../../../services/public/public.service';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ToastrModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  rememberMe: boolean = false;
  username: string = 'swayam';
  password: string = 'password';
  loginForm: FormGroup;
  isLoading: boolean = false;
  constructor(private router: Router, private toastr: ToastrService, private publicService: PublicService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required])
    });
  }
  showPassword: boolean = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please enter Username and Password');
      return;
    }

    // Start loading
    this.isLoading = true;

    const formValues = this.loginForm.value;
    const credentials: LoginCredentials = {
      username: formValues.username, // use 'username' as input, send 'email' to backend
      password: formValues.password
    };
    console.log('Login credentials:', credentials);
    this.publicService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false; // Stop loading on success
        this.toastr.success('Login Successful');
        this.publicService.storeTokenAndRole(response.token, response.role, response.name, response.empId);
        localStorage.setItem('user', JSON.stringify(credentials));
        if (this.rememberMe) {

        }

        // Role-based redirect
        switch (response.role) {
          case 'DELIVERY_MANAGER':
            this.router.navigate(['/delivery-manager']);
            break;
          case 'PROJECT_MANAGER':
            this.router.navigate(['/project-manager']);
            break;
          case 'RESOURCE':
            this.router.navigate(['/resource']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.isLoading = false; // Stop loading on error
        if (error.status === 403) {
          this.toastr.error('Invalid email or password.');
        } else {
          this.toastr.error('Something went wrong. Please try again later.');
        }
        console.error('Login error:', error);
      }
    });
  }

}
