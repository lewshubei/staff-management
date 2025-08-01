import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'employee/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['employee'] },
  },
  {
    path: 'intern/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['intern'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    data: { roles: ['admin', 'employee', 'intern'] },
  },
];
