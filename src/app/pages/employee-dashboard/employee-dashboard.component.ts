import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px; background: lightblue; min-height: 100vh;">
      <h1>TEST: Employee Dashboard is Working!</h1>
      <p>If you can see this, the component is loading correctly.</p>
      <p>Current user: {{ getCurrentUser()?.username || 'No user found' }}</p>
      <button (click)="testClick()">Test Button</button>
    </div>
  `,
  styles: [],
})
export class EmployeeDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {
    console.log('✅ EmployeeDashboardComponent constructor called');
  }

  ngOnInit() {
    console.log('✅ EmployeeDashboardComponent ngOnInit called');
  }

  getCurrentUser(): any {
    const user = this.authService.getCurrentUser();
    console.log('🔍 Current user:', user);
    return user;
  }

  testClick() {
    console.log('✅ Test button clicked!');
    alert('Component is working!');
  }

  logout(): void {
    this.authService.logout();
  }
}
