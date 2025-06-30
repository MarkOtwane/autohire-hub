import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuditListComponent } from './audit-list/audit-list.component';
import { AuditRoutingModule } from './audit-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuditRoutingModule, SharedModule],
})
export class AuditModule {}
