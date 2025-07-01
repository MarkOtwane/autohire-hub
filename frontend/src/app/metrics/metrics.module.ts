import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardMetricsComponent } from './dashboard-metrics/dashboard-metrics.component';
import { MetricsRoutingModule } from './metrics-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MetricsRoutingModule,
    SharedModule,
  ],
})
export class MetricsModule {}
