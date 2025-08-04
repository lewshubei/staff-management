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
  users: User[] = [];
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
  formatRoleName(roleId: number | string | undefined): string {
    if (!roleId) return 'Unknown';

    // Convert to number if it's a string
    const id = typeof roleId === 'string' ? parseInt(roleId) : roleId;

    // Map role IDs to names
    const roleNames: { [key: number]: string } = {
      1: 'Admin',
      2: 'Employee',
      3: 'Intern',
    };

    return roleNames[id] || 'Unknown';
  }

  // Add helper method to get role class for CSS styling
  getRoleClass(roleId: number | string | undefined): string {
    if (!roleId) return 'role-unknown';

    const id = typeof roleId === 'string' ? parseInt(roleId) : roleId;

    const roleClasses: { [key: number]: string } = {
      1: 'role-admin',
      2: 'role-employee',
      3: 'role-intern',
    };

    return roleClasses[id] || 'role-unknown';
  }

  // Your existing methods...
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
        console.error('Error loading users:', error);
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
