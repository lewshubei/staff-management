import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  selectedRole = 'employee'; // Default role
  errorMsg = '';
  successMsg = '';
  isLoading = false;

  roles = [
    { value: 'employee', label: 'Employee' },
    { value: 'intern', label: 'Intern' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    // Validation
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const registerData = {
      username: this.username,
      email: this.email,
      password: this.password,
      roles: [this.selectedRole],
    };

    console.log('Register attempt:', registerData);

    this.auth.register(registerData).subscribe({
      next: (res: any) => {
        console.log('Register response:', res);
        this.isLoading = false;
        this.successMsg = 'Registration successful! Redirecting to login...';

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Register error:', err);
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Registration failed';
      },
    });
  }
}
