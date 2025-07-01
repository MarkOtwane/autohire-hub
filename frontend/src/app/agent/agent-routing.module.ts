import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { AgentBookingsComponent } from './bookings/agent-bookings.component';
import { AgentDashboardComponent } from './dashboard/agent-dashboard.component';
import { AgentMetricsComponent } from './metrics/agent-metrics.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: ['AGENT'] },
    children: [
      { path: 'dashboard', component: AgentDashboardComponent },
      { path: 'bookings', component: AgentBookingsComponent },
      { path: 'metrics', component: AgentMetricsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentRoutingModule {}
