import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface UserRole {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm = {
    username: '',
    fullName: '', // Add this new field
    email: '',
    roleId: '',
    password: '',
    confirmPassword: '',
  };

  // Available roles for registration
  availableRoles: UserRole[] = [
    {
      id: 2,
      name: 'ROLE_EMPLOYEE',
      displayName: 'Employee',
      description: 'Full-time employee with standard access',
    },
    {
      id: 3,
      name: 'ROLE_INTERN',
      displayName: 'Intern',
      description: 'Intern with limited access and learning opportunities',
    },
  ];

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('🔍 Available roles:', this.availableRoles);
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isLoading = true;
      this.errorMessage = '';

      const registrationData = {
        username: this.registerForm.username,
        email: this.registerForm.email,
        fullName: this.registerForm.fullName,
        password: this.registerForm.password,
        roleId: parseInt(this.registerForm.roleId),
      };

      // Enhanced logging
      console.log('🔍 FRONTEND - Raw form data:', this.registerForm);
      console.log(
        '🔍 FRONTEND - Processed registration data:',
        registrationData
      );
      console.log('🔍 FRONTEND - RoleId type:', typeof registrationData.roleId);
      console.log('🔍 FRONTEND - RoleId value:', registrationData.roleId);

      this.auth.register(registrationData).subscribe({
        next: (response: any) => {
          console.log('✅ REGISTRATION RESPONSE:', response);
          // Don't log roles here - registration response doesn't include them

          this.successMessage =
            'Registration successful! Please login to continue.';
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error: any) => {
          console.error('❌ Registration error:', error);
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

    // Check required fields - ADD fullName validation
    if (
      !this.registerForm.username ||
      !this.registerForm.fullName ||
      !this.registerForm.email ||
      !this.registerForm.password ||
      !this.registerForm.confirmPassword ||
      !this.registerForm.roleId
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Validate username length
    if (this.registerForm.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters';
      return false;
    }

    // Validate fullName length
    if (this.registerForm.fullName.length < 2) {
      this.errorMessage = 'Full name must be at least 2 characters';
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

    // Validate role selection
    const selectedRoleId = parseInt(this.registerForm.roleId);
    const validRoleIds = this.availableRoles.map((role) => role.id);
    if (!validRoleIds.includes(selectedRoleId)) {
      this.errorMessage = 'Please select a valid role';
      return false;
    }

    return true;
  }

  resetForm() {
    this.registerForm = {
      username: '',
      fullName: '', // Add this to reset function
      email: '',
      roleId: '', // Default to Employee
      password: '',
      confirmPassword: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helper method to get selected role info
  getSelectedRoleInfo(): UserRole | undefined {
    const selectedId = parseInt(this.registerForm.roleId);
    return this.availableRoles.find((role) => role.id === selectedId);
  }
  onRoleChange() {
    console.log('Role changed to:', this.registerForm.roleId);
    console.log('Role type:', typeof this.registerForm.roleId);
    const selectedRole = this.getSelectedRoleInfo();
    console.log('Selected role info:', selectedRole);
  }
}
