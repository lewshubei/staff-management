import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Attendance } from '../models/attendance.model';

// Interface for User Report Response
export interface UserReportData {
  users: User[];
  summary: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
  };
}

// Interface for Attendance Report Response
export interface AttendanceReportData {
  attendances: Attendance[];
  summary: {
    totalRecords: number;
    presentDays: number;
    absentDays: number;
    averageWorkingHours: number;
  };
}

// Interface for Registration Report Response
export interface RegistrationReportData {
  users: User[];
  summary: {
    totalRegistrations: number;
    registrationsByDate: { [key: string]: number };
    averagePerDay: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Reports Service - Token exists:', !!token);

    return new HttpHeaders({
      'x-access-token': token || '',
      'Content-Type': 'application/json',
    });
  }

  // Generate user activity report
  generateUserReport(
    dateFrom?: string,
    dateTo?: string
  ): Observable<UserReportData> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.http.get<UserReportData>(`${this.apiUrl}/reports/users`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  // Generate registration report
  generateRegistrationReport(
    dateFrom?: string,
    dateTo?: string
  ): Observable<RegistrationReportData> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.http.get<RegistrationReportData>(
      `${this.apiUrl}/reports/registrations`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Generate attendance report
  generateAttendanceReport(
    dateFrom?: string,
    dateTo?: string
  ): Observable<AttendanceReportData> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.http.get<AttendanceReportData>(
      `${this.apiUrl}/reports/attendance`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Export users data as CSV
  exportUsersCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/users/csv`, {
      responseType: 'blob',
      headers: this.getAuthHeaders(),
    });
  }

  // Export attendance data as CSV
  exportAttendanceCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/attendance/csv`, {
      responseType: 'blob',
      headers: this.getAuthHeaders(),
    });
  }

  // Get dashboard statistics (user stats) - FIX: Add auth headers
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/stats`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Export users data as Excel (when implemented) - FIX: Add auth headers
  exportUsersExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/users/excel`, {
      responseType: 'blob',
      headers: this.getAuthHeaders(),
    });
  }

  // Export attendance data as Excel (when implemented) - FIX: Add auth headers
  exportAttendanceExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/attendance/excel`, {
      responseType: 'blob',
      headers: this.getAuthHeaders(),
    });
  }

  // Generate custom report with filters - FIX: Add auth headers
  generateCustomReport(reportType: string, filters: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reports/custom`,
      {
        type: reportType,
        filters: filters,
      },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Get report history (if you implement report saving) - FIX: Add auth headers
  getReportHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/history`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete saved report (if you implement report saving) - FIX: Add auth headers
  deleteReport(reportId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reports/${reportId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Test API connection (for debugging)
  testApiConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/test`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Remove the testApiCall method - it's not needed in a service
  // If you want to test, do it in the component or console
}
