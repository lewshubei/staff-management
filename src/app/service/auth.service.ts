import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method - expects username and password
  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/signin`, {
        username: username,
        password: password,
      })
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);

          // Store the token and user data
          if (response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response));
            console.log('Token stored successfully');
          }
        })
      );
  }

  // Register method - expects username, email, and password
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, {
      username: username,
      email: email,
      password: password,
    });
  }

  // Check if user is authenticated (ADD THIS METHOD)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // Optional: Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  // Get user role (ADD THIS METHOD)
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    if (user && user.roles && user.roles.length > 0) {
      // Return the first role, or check for admin specifically
      return user.roles.includes('ROLE_ADMIN')
        ? 'admin'
        : user.roles.includes('ROLE_EMPLOYEE')
        ? 'employee'
        : user.roles.includes('ROLE_INTERN')
        ? 'intern'
        : null;
    }
    return null;
  }

  // Check if user is admin (HELPER METHOD)
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin';
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Check if user is logged in (ALIAS for isAuthenticated)
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Get current user
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
