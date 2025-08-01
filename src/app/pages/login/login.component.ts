import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.errorMsg = '';
    console.log('Login attempt:', this.username, this.password);
    this.auth
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          console.log('Login response:', res);
          this.auth.setUserData(res); // Store both token and user data
          const role = this.auth.getUserRole();
          console.log('User role:', role);
          this.isLoading = false;
          this.router.navigate([`/${role}/dashboard`]);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.isLoading = false;
          this.errorMsg = err.error?.message || 'Login failed';
        },
      });
  }
}
