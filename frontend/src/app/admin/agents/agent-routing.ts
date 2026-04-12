import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AgentsListComponent } from './agent-list/agent-list.component';
import { AgentCreateComponent } from './agent-create/agent-create.component';
import { AgentEditComponent } from './agent-edit/agent-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AgentsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'create',
    component: AgentCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'edit/:id',
    component: AgentEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {}
