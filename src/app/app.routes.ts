import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { InternDashboardComponent } from './pages/intern-dashboard/intern-dashboard.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { CreateUserComponent } from './pages/admin/create-user/create-user.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'employee/dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['employee'] },
  },
  {
    path: 'intern/dashboard',
    component: InternDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['intern'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'employee', 'intern'] },
  },
];
