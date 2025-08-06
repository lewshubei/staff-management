import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import {
  UpdateUserRequest,
  UserService,
  UserWithRole,
} from '../../service/user.service';

@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './intern-dashboard.component.html',
  styleUrl: './intern-dashboard.component.css',
})
export class InternDashboardComponent implements OnInit {
  currentUser: UserWithRole | null = null;
  needsInternshipPeriod = false;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  internshipForm = {
    startDate: '',
    endDate: '',
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.getCurrentUser();
    if (!user || !user.id) {
      this.errorMessage = 'Unable to get user information';
      this.isLoading = false;
      return;
    }

    this.userService.getUserById(user.id).subscribe({
      next: (userData: UserWithRole) => {
        this.currentUser = userData;

        console.log(
          '🔍 FRONTEND - Full response received:',
          JSON.stringify(userData, null, 2)
        );
        console.log('🔍 FRONTEND - internshipStart:', userData.internshipStart);
        console.log('🔍 FRONTEND - internshipEnd:', userData.internshipEnd);

        // Check if internship period needs to be set
        if (userData.internshipStart && userData.internshipEnd) {
          this.needsInternshipPeriod = false;
          console.log('✅ FRONTEND - Both dates exist, showing dashboard');
        } else {
          this.needsInternshipPeriod = true;
          console.log('❌ FRONTEND - Missing dates, showing setup form');
        }

        this.isLoading = false;
        console.log(
          '🔍 FRONTEND - Final needsInternshipPeriod:',
          this.needsInternshipPeriod
        );
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.errorMessage = 'Failed to load user information';
        this.isLoading = false;
      },
    });
  }

  updateInternshipPeriod(): void {
    if (!this.internshipForm.startDate || !this.internshipForm.endDate) {
      this.errorMessage = 'Please fill in both start and end dates';
      return;
    }

    if (
      new Date(this.internshipForm.startDate) >=
      new Date(this.internshipForm.endDate)
    ) {
      this.errorMessage = 'End date must be after start date';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.getCurrentUser();
    const updateData: UpdateUserRequest = {
      internshipStart: this.internshipForm.startDate,
      internshipEnd: this.internshipForm.endDate,
    };

    this.userService.updateUser(user.id, updateData).subscribe({
      next: (response) => {
        this.successMessage = 'Internship period set successfully!';
        this.isSubmitting = false;

        // Reload user data to reflect changes and hide the form
        this.loadUserData();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error setting internship period:', error);
        this.errorMessage =
          error.error?.message || 'Failed to set internship period';
        this.isSubmitting = false;
      },
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  calculateDuration(): number {
    if (
      !this.currentUser?.internshipStart ||
      !this.currentUser?.internshipEnd
    ) {
      return 0;
    }

    const start = new Date(this.currentUser.internshipStart);
    const end = new Date(this.currentUser.internshipEnd);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  getProgressPercentage(): number {
    if (
      !this.currentUser?.internshipStart ||
      !this.currentUser?.internshipEnd
    ) {
      return 0;
    }

    const start = new Date(this.currentUser.internshipStart);
    const end = new Date(this.currentUser.internshipEnd);
    const today = new Date();

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const completedDays = Math.max(
      0,
      Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    const percentage = Math.min(
      100,
      Math.max(0, (completedDays / totalDays) * 100)
    );
    return Math.round(percentage);
  }

  getDaysCompleted(): number {
    if (!this.currentUser?.internshipStart) {
      return 0;
    }

    const start = new Date(this.currentUser.internshipStart);
    const today = new Date();
    const completed = Math.max(
      0,
      Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    return Math.max(0, completed);
  }

  getDaysRemaining(): number {
    if (!this.currentUser?.internshipEnd) {
      return 0;
    }

    const end = new Date(this.currentUser.internshipEnd);
    const today = new Date();
    const remaining = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, remaining);
  }

  getInternshipStatus(): string {
    if (
      !this.currentUser?.internshipStart ||
      !this.currentUser?.internshipEnd
    ) {
      return 'Not Set';
    }

    const start = new Date(this.currentUser.internshipStart);
    const end = new Date(this.currentUser.internshipEnd);
    const today = new Date();

    if (today < start) {
      return 'Upcoming';
    } else if (today > end) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
