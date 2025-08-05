import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add RouterModule for routerLink
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('🔍 Login successful:', response);
          console.log('🔍 User roles:', response.roles);
          console.log('🔍 Roles type:', typeof response.roles);
          console.log('🔍 Is roles array?', Array.isArray(response.roles));

          this.isLoading = false;

          // Navigate based on user role
          if (response.roles && response.roles.includes('ROLE_ADMIN')) {
            console.log('✅ Navigating to admin dashboard');
            this.router.navigate(['/admin/dashboard']);
          } else if (response.roles.includes('ROLE_EMPLOYEE')) {
            console.log('✅ Navigating to employee dashboard');
            this.router.navigate(['/employee/dashboard']);
          } else if (response.roles.includes('ROLE_INTERN')) {
            console.log('✅ Navigating to intern dashboard');
            this.router.navigate(['/intern/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
