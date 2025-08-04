import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="intern-layout">
      <header class="intern-header">
        <div class="header-content">
          <h1>Intern Dashboard</h1>
          <div class="user-info">
            <span>Welcome, {{ getCurrentUser()?.username || 'Intern' }}</span>
            <button (click)="logout()" class="logout-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="intern-main">
        <div class="welcome-section">
          <h2>Welcome to Intern Portal</h2>
          <p>Your learning journey starts here!</p>
        </div>

        <div class="intern-features">
          <div class="feature-card">
            <h3>Learning Resources</h3>
            <p>Access training materials and documentation</p>
          </div>

          <div class="feature-card">
            <h3>Tasks & Projects</h3>
            <p>View your assigned tasks and project progress</p>
          </div>

          <div class="feature-card">
            <h3>Mentor Support</h3>
            <p>Connect with your mentors and supervisors</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .intern-layout {
        min-height: 100vh;
        background: #f0fdf4;
      }

      .intern-header {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 0 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
      }

      .header-content h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .logout-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .logout-btn svg {
        width: 16px;
        height: 16px;
      }

      .intern-main {
        padding: 2rem;
      }

      .welcome-section {
        text-align: center;
        margin-bottom: 3rem;
      }

      .welcome-section h2 {
        color: #1e293b;
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .intern-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-4px);
      }

      .feature-card h3 {
        color: #10b981;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class InternDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
