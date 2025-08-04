import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  UserService,
  CreateUserRequest,
  ApiResponse,
} from '../../../service/user.service';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  userForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    fullName: '',
  };

  roles: Role[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles';
      },
    });
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.errorMessage = '';

      // Prepare user data with proper types
      const userData: CreateUserRequest = {
        username: this.userForm.username,
        email: this.userForm.email,
        password: this.userForm.password,
        roleId: this.userForm.roleId
          ? parseInt(this.userForm.roleId)
          : undefined,
        fullName: this.userForm.fullName || this.userForm.username,
      };

      console.log('Submitting user data:', userData);

      this.userService.createUser(userData).subscribe({
        next: (response: ApiResponse) => {
          console.log('User created successfully:', response);
          this.successMessage =
            response.message || 'User created successfully!';
          this.isLoading = false;

          // Redirect to user list after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Error creating user:', error);
          this.errorMessage = error.error?.message || 'Failed to create user';
          this.isLoading = false;
        },
      });
    }
  }

  validateForm(): boolean {
    // Clear previous error
    this.errorMessage = '';

    if (
      !this.userForm.username ||
      !this.userForm.email ||
      !this.userForm.password
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (this.userForm.password !== this.userForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.userForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    // Validate roleId if provided
    if (this.userForm.roleId && isNaN(parseInt(this.userForm.roleId))) {
      this.errorMessage = 'Please select a valid role';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.userForm = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: '',
      fullName: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
