import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiURL = 'http://localhost:8080/api/auth'; // Updated to match backend

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { username: string; password: string }) {
    return this.http.post(`${this.apiURL}/signin`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiURL}/signup`, data);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUserData(userData: any) {
    localStorage.setItem('token', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const user = localStorage.getItem('user');
    if (!user) return '';
    const userData = JSON.parse(user);
    // Backend returns roles like ["ROLE_INTERN"], extract the role part
    const role = userData.roles[0]; // e.g., "ROLE_INTERN"
    return role.replace('ROLE_', '').toLowerCase(); // Returns "intern"
  }
}
