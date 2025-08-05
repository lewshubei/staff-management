import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService // Add AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Add these methods for header functionality
  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }

  // Update the formatRoleName method to handle role IDs
  formatRoleName(roleData: any): string {
    console.log('🔍 formatRoleName input:', roleData);

    // Handle different role data formats
    if (Array.isArray(roleData) && roleData.length > 0) {
      // roles is an array of role objects
      return roleData[0].name
        .replace('ROLE_', '')
        .toLowerCase()
        .replace(/^\w/, (c: string) => c.toUpperCase());
    }

    if (typeof roleData === 'string') {
      // roles is a string
      return roleData
        .replace('ROLE_', '')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
    }

    if (typeof roleData === 'number') {
      // roleId is a number - map to role name
      const roleMap: { [key: number]: string } = {
        1: 'Admin',
        2: 'Employee',
        3: 'Intern',
      };
      return roleMap[roleData] || 'Unknown';
    }

    return 'No Role';
  }

  // Add helper method to get role class for CSS styling
  getRoleClass(roleData: any): string {
    const roleName = this.formatRoleName(roleData).toLowerCase();
    return `role-${roleName}`;
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (response: any[]) => {
        console.log('FRONTEND - Received users:', response);
        this.users = response.map((user) => ({
          ...user,
          // Transform roles array to display format
          roleNames: user.roles ? user.roles.map((role: any) => role.name) : [],
          primaryRole:
            user.roles && user.roles.length > 0
              ? user.roles[0].name
              : 'No Role',
          roleId: user.roles && user.roles.length > 0 ? user.roles[0].id : null,
        }));
        console.log('FRONTEND - Processed users:', this.users);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('FRONTEND - Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      },
    });
  }

  editUser(user: User): void {
    // Navigate to edit page or open edit modal
    this.router.navigate(['/admin/edit-user', user.id]);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          this.loadUsers(); // Reload the list
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user. Please try again.';
          console.error('Error deleting user:', error);
        },
      });
    }
  }
}
