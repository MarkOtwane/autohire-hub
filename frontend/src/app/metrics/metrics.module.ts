import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MetricsRoutingModule } from './metrics-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MetricsRoutingModule, SharedModule],
})
export class MetricsModule {}
