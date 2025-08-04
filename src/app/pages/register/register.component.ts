import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.validateForm()) {
      this.isLoading = true;
      this.errorMessage = '';

      // Pass all 3 required parameters: username, email, password
      this.auth
        .register(
          this.registerForm.username,
          this.registerForm.email,
          this.registerForm.password
        )
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.successMessage = 'Registration successful! Please login.';
            this.isLoading = false;

            // Redirect to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.errorMessage =
              error.error?.message || 'Registration failed. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }

  validateForm(): boolean {
    // Reset error message
    this.errorMessage = '';

    // Check required fields
    if (
      !this.registerForm.username ||
      !this.registerForm.email ||
      !this.registerForm.password
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    // Check password length
    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    // Check password confirmation
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    return true;
  }

  resetForm() {
    this.registerForm = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
