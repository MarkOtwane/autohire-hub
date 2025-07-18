import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditListComponent } from './audit-list/audit-list.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: AuditListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {}
