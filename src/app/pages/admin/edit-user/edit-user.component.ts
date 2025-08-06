import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService, UserWithRole } from '../../../service/user.service';
import { AuthService } from '../../../service/auth.service';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  userId!: number;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  resetPassword = false;

  availableRoles: Role[] = [];

  userForm = {
    username: '',
    email: '',
    fullName: '',
    roleId: '',
    password: '',
    internshipStart: '',
    internshipEnd: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRoles();
    this.loadUser();
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      },
    });
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user: UserWithRole) => {
        console.log(
          '🔍 EDIT USER - Full user data received:',
          JSON.stringify(user, null, 2)
        );
        console.log(
          '🔍 EDIT USER - Raw internshipStart:',
          user.internshipStart
        );
        console.log('🔍 EDIT USER - Raw internshipEnd:', user.internshipEnd);

        // Format dates for input fields (convert from ISO to YYYY-MM-DD)
        let formattedStartDate = '';
        let formattedEndDate = '';

        if (user.internshipStart) {
          // Convert ISO datetime to YYYY-MM-DD format
          const startDate = new Date(user.internshipStart);
          if (!isNaN(startDate.getTime())) {
            formattedStartDate = startDate.toISOString().split('T')[0];
            console.log(
              '✅ EDIT USER - Formatted start date:',
              formattedStartDate
            );
          }
        }

        if (user.internshipEnd) {
          // Convert ISO datetime to YYYY-MM-DD format
          const endDate = new Date(user.internshipEnd);
          if (!isNaN(endDate.getTime())) {
            formattedEndDate = endDate.toISOString().split('T')[0];
            console.log('✅ EDIT USER - Formatted end date:', formattedEndDate);
          }
        }

        this.userForm = {
          username: user.username,
          email: user.email,
          fullName: user.fullName || '',
          roleId:
            user.roles &&
            user.roles.length > 0 &&
            user.roles[0] &&
            user.roles[0].id !== undefined
              ? user.roles[0].id.toString()
              : '',
          password: '',
          internshipStart: formattedStartDate, // This should now be "2025-08-06"
          internshipEnd: formattedEndDate, // This should now be "2025-10-06"
        };

        console.log(
          '🔍 EDIT USER - Final userForm.internshipStart:',
          this.userForm.internshipStart
        );
        console.log(
          '🔍 EDIT USER - Final userForm.internshipEnd:',
          this.userForm.internshipEnd
        );

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user information';
        this.isLoading = false;
        console.error('Error loading user:', error);
      },
    });
  }

  updateUser(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: any = {
      username: this.userForm.username,
      email: this.userForm.email,
      fullName: this.userForm.fullName,
      roleId: Number(this.userForm.roleId),
    };

    // Add password if resetting
    if (this.resetPassword && this.userForm.password) {
      updateData.password = this.userForm.password;
    }

    // Add internship data if user is intern
    if (this.isIntern()) {
      updateData.internshipStart = this.userForm.internshipStart || null;
      updateData.internshipEnd = this.userForm.internshipEnd || null;
    }

    this.userService.updateUser(this.userId, updateData).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update user';
        this.isSubmitting = false;
      },
    });
  }

  isIntern(): boolean {
    const selectedRole = this.availableRoles.find(
      (role) =>
        role.id !== undefined && role.id.toString() === this.userForm.roleId
    );
    return selectedRole?.name.toLowerCase().includes('intern') || false;
  }

  formatRoleName(roleName: string): string {
    return roleName
      .replace('ROLE_', '')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
