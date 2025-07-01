import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuditRoutingModule } from './audit-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuditRoutingModule, SharedModule],
})
export class AuditModule {}
