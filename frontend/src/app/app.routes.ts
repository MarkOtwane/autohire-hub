import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AgreementFormComponent } from './agreements/agreement-form/agreement-form.component';
import { AgreementSuccessComponent } from './agreements/agreement-success/agreement-success.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';

export const routes: Routes = [
  // Redirect empty path to login or home
  { path: '', component: HomeComponent },
  { path: 'agreements/new', component: AgreementFormComponent },
  { path: 'agreements/success', component: AgreementSuccessComponent },

  // Auth module (login, register, etc.)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // User
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['USER'] },
  },

  // Agent
  {
    path: 'agent',
    loadChildren: () =>
      import('./agent/agent.module').then((m) => m.AgentModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['AGENT'] },
  },

  // Admin
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'MAIN_ADMIN'] },
  },
  {
    path: 'vehicle',
    loadChildren: () =>
      import('./admin/vehicles/vehicles.module').then((m) => m.VehiclesModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'MAIN_ADMIN', 'AGENT'] },
  },

  // Public vehicle listings
  {
    path: 'vehicles',
    loadChildren: () =>
      import('./vehicle/vehicle.module').then((m) => m.VehiclesModule),
  },

  // Bookings
  {
    path: 'bookings',
    loadChildren: () =>
      import('./bookings/bookings.module').then((m) => m.BookingsModule),
    canActivate: [AuthGuard],
  },

  // Payments
  {
    path: 'payments',
    loadChildren: () =>
      import('./payments/payments.module').then((m) => m.PaymentsModule),
    canActivate: [AuthGuard],
  },

  // Support
  {
    path: 'support',
    loadChildren: () =>
      import('./support/support.module').then((m) => m.SupportModule),
    canActivate: [AuthGuard],
  },

  // Notifications
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then(
        (m) => m.NotificationsModule,
      ),
    canActivate: [AuthGuard],
  },

  // Metrics
  {
    path: 'metrics',
    loadChildren: () =>
      import('./metrics/metrics.module').then((m) => m.MetricsModule),
    canActivate: [AuthGuard],
  },

  // Audit
  {
    path: 'audit',
    loadChildren: () =>
      import('./audit/audit.module').then((m) => m.AuditModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
  },

  { path: 'login', component: LoginComponent },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  // If you have a specific main admin dashboard:
  {
    path: 'admin/dashboard/main', // This path would be hit if isMainAdmin is true
    component: DashboardComponent, // Or MainAdminDashboardComponent
    canActivate: [AuthGuard],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' },
];

export class AppRoutingModule {}
