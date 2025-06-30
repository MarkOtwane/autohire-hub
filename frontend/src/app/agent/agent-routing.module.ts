import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDashboardComponent } from './dashboard/agent-dashboard.component';
import { AgentBookingsComponent } from './bookings/agent-bookings.component';
import { AgentMetricsComponent } from './metrics/agent-metrics.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';

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
