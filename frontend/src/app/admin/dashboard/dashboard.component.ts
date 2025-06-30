import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../../core/services/metrics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.metricsService.getAdminMetrics().subscribe((data) => {
      this.stats = data;
      this.loading = false;
    });
  }
}
