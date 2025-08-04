import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  UserService,
  CreateUserRequest,
  ApiResponse,
} from '../../../service/user.service';
import { Role } from '../../../models/role.model';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  // Removed confirmPassword - admin sets password directly
  userForm = {
    username: '',
    email: '',
    fullName: '',
    password: '',
    roleId: '',
  };

  roles: Role[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService // Add AuthService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    // Set default role to Employee (adjust ID as needed)
    this.userForm.roleId = '2';
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        console.log('Roles loaded:', roles);
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles. Please refresh the page.';
      },
    });
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.errorMessage = '';

      // Prepare user data for admin creation
      const userData: CreateUserRequest = {
        username: this.userForm.username,
        email: this.userForm.email,
        password: this.userForm.password,
        roleId: this.userForm.roleId
          ? parseInt(this.userForm.roleId)
          : undefined,
        fullName: this.userForm.fullName || this.userForm.username,
      };

      console.log('Admin creating user:', userData);

      this.userService.createUser(userData).subscribe({
        next: (response: ApiResponse) => {
          console.log('User created successfully:', response);
          this.successMessage =
            response.message || 'User created successfully!';
          this.isLoading = false;

          // Navigate to user list immediately after successful creation
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 1500);
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

    // Check required fields (removed confirmPassword validation)
    if (
      !this.userForm.username ||
      !this.userForm.email ||
      !this.userForm.password ||
      !this.userForm.roleId
    ) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    // Validate username length
    if (this.userForm.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters';
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    // Validate password length (admin sets this)
    if (this.userForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    // Validate role selection
    if (this.userForm.roleId && isNaN(parseInt(this.userForm.roleId))) {
      this.errorMessage = 'Please select a valid role';
      return false;
    }

    return true;
  }

  // Generate a random password for the user
  generatePassword(): void {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    const passwordLength = 8;
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.userForm.password = password;
  }

  resetForm(): void {
    this.userForm = {
      username: '',
      email: '',
      fullName: '',
      password: '',
      roleId: '2', // Reset to default role
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Get selected role information
  getSelectedRole(): Role | null {
    if (!this.userForm.roleId) return null;

    const selectedId = parseInt(this.userForm.roleId);
    if (isNaN(selectedId)) return null;

    return this.roles.find((role) => role.id === selectedId) || null;
  }

  // Helper method to safely get role name
  getSelectedRoleName(): string {
    if (!this.userForm.roleId) return '';

    const selectedRole = this.roles.find(
      (role) => role.id === parseInt(this.userForm.roleId)
    );
    if (!selectedRole || !selectedRole.name) return '';

    return selectedRole.name
      .replace('ROLE_', '')
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper method to safely get role description
  getSelectedRoleDescription(): string {
    if (!this.userForm.roleId) return '';

    const selectedRole = this.roles.find(
      (role) => role.id === parseInt(this.userForm.roleId)
    );
    if (!selectedRole || !selectedRole.name) return '';

    return this.getRoleDescription(selectedRole.name);
  }

  // Role description mapping
  getRoleDescription(roleName: string | undefined): string {
    if (!roleName) return 'Standard user role';

    const descriptions: { [key: string]: string } = {
      ROLE_ADMIN: 'Full administrative access to all system features',
      ROLE_EMPLOYEE: 'Standard employee access with full system permissions',
      ROLE_INTERN: 'Limited access for interns with learning opportunities',
      ROLE_USER: 'Basic user access with standard permissions',
    };

    return descriptions[roleName] || 'Standard user role';
  }

  // Add these methods for header functionality
  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
