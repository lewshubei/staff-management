import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }
}
