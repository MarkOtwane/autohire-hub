import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Redirect empty path to login or home
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

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
    data: { roles: ['ADMIN'] },
  },

  // Public vehicle listings
  {
    path: 'vehicles',
    loadChildren: () =>
      import('./admin/vehicles/vehicles.module').then((m) => m.VehiclesModule),
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
        (m) => m.NotificationsModule
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

  // Wildcard fallback
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
