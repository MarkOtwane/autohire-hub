// src/app/admin/admin-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'MAIN_ADMIN'] },
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'vehicles',
        loadChildren: () =>
          import('./vehicles/vehicles.module').then((m) => m.VehiclesModule),
      },
      {
        path: 'agents',
        loadChildren: () =>
          import('./agents/agent.module').then((m) => m.AgentsModule),
      },
      {
        path: 'bookings',
        loadChildren: () =>
          import('./bookings/bookings.module').then((m) => m.BookingsModule),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('../user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'issues',
        loadChildren: () =>
          import('../support/support.module').then((m) => m.SupportModule),
      },
      {
        path: 'notifications', // This will be /admin/notifications (for 'Send Notification')
        loadChildren: () =>
          import('../notifications/notifications.module').then(
            (m) => m.NotificationsModule,
          ),
      },
    ],
  },
  // --- EXISTING TOP-LEVEL ROUTES (UNCHANGED, assuming they are not admin sub-sections) ---
  {
    path: 'audit',
    loadChildren: () =>
      import('../audit/audit.module').then((m) => m.AuditModule),
  },
  {
    path: 'metrics', // This route refers to a separate metrics module/page, not the API call
    loadChildren: () =>
      import('../metrics/metrics.module').then((m) => m.MetricsModule),
  },
  {
    path: 'support',
    loadChildren: () =>
      import('../support/support.module').then((m) => m.SupportModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
