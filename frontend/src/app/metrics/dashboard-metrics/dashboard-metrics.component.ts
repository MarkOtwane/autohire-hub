import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-dashboard-metrics',
  templateUrl: './dashboard-metrics.component.html',
  styleUrls: ['./dashboard-metrics.component.scss'],
})
export class DashboardMetricsComponent implements OnInit {
  metrics: any;
  loading = true;

  constructor(
    private metricsService: MetricsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole(); // assume token or session provides this

    if (role === 'ADMIN') {
      this.metricsService.getAdminMetrics().subscribe((data) => {
        this.metrics = data;
        this.loading = false;
      });
    } else if (role === 'AGENT') {
      this.metricsService.getAgentMetrics().subscribe((data) => {
        this.metrics = data;
        this.loading = false;
      });
    }
  }
}
