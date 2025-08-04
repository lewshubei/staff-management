import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserService, UserStatsResponse } from '../../service/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  analytics = {
    totalUsers: 0,
    adminCount: 0,
    employeeCount: 0,
    internCount: 0,
    recentActivity: 0,
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadDashboardStats();
  }

  loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadDashboardStats() {
    this.isLoading = true;
    this.userService.getUserStats().subscribe({
      next: (stats: UserStatsResponse) => {
        this.analytics = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.errorMessage = 'Failed to load statistics';
        this.isLoading = false;
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
