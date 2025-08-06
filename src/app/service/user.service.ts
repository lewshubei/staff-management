import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { tap } from 'rxjs/operators';

export interface UserWithRole extends User {
  fullName?: string;
  primaryRole?: string;
  roles?: Role[];
  // Add internship fields
  internshipStart?: string;
  internshipEnd?: string;
}

export interface UserStatsResponse {
  totalUsers: number;
  adminCount: number;
  employeeCount: number;
  internCount: number;
  recentActivity: number;
}

// Add these interfaces for better type safety
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleId?: number;
  fullName?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  roleId?: number;
  password?: string;
  internshipStart?: string;
  internshipEnd?: string;
}

export interface ApiResponse {
  message: string;
  user?: UserWithRole;
  success?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(
      'Token from localStorage:',
      token ? 'Token exists' : 'No token found'
    );

    if (!token) {
      console.error('No authentication token found in localStorage');
    }

    return new HttpHeaders({
      'x-access-token': token || '',
      'Content-Type': 'application/json',
    });
  }

  // Create user with proper typing
  createUser(userData: CreateUserRequest): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    console.log('Creating new user:', userData.username);
    return this.http.post<ApiResponse>(`${this.apiUrl}/users`, userData, {
      headers,
    });
  }

  // Update user information
  updateUser(
    userId: number,
    userData: UpdateUserRequest
  ): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    console.log(`Updating user ${userId}:`, userData);
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/users/${userId}`,
      userData,
      { headers }
    );
  }

  // Get user by ID
  getUserById(userId: number): Observable<UserWithRole> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserWithRole>(`${this.apiUrl}/users/${userId}`, {
      headers,
    });
  }

  // Get all users with their roles
  getAllUsers(): Observable<UserWithRole[]> {
    const headers = this.getAuthHeaders();
    console.log(
      'Making request to /api/users with headers:',
      headers.get('x-access-token') ? 'Token present' : 'No token'
    );

    return this.http
      .get<UserWithRole[]>(`${this.apiUrl}/users`, { headers })
      .pipe(
        tap((response) => console.log('UserService - Response:', response))
      );
  }

  // Get user statistics for dashboard
  getUserStats(): Observable<UserStatsResponse> {
    const headers = this.getAuthHeaders();
    console.log(
      'Making request to /api/reports/stats with headers:',
      headers.get('x-access-token') ? 'Token present' : 'No token'
    );

    return this.http.get<UserStatsResponse>(`${this.apiUrl}/reports/stats`, {
      headers,
    });
  }

  // Get all roles
  getAllRoles(): Observable<Role[]> {
    const headers = this.getAuthHeaders();
    console.log(
      'Making request to /api/roles with headers:',
      headers.get('x-access-token') ? 'Token present' : 'No token'
    );

    return this.http.get<Role[]>(`${this.apiUrl}/roles`, { headers });
  }

  // Update user role
  updateUserRole(userId: number, roleId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/users/${userId}/role`,
      { roleId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Reset user password
  resetPassword(userId: number, newPassword: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/users/${userId}/reset-password`,
      { password: newPassword },
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete user
  deleteUser(userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
