import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MetricsRoutingModule } from './metrics-routing.module';
import { DashboardMetricsComponent } from './dashboard-metrics/dashboard-metrics.component';

@NgModule({
  imports: [CommonModule, MetricsRoutingModule, SharedModule, DashboardMetricsComponent],
})
export class MetricsModule {}
