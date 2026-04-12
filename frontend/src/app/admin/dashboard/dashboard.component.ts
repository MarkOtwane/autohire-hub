// src/app/admin/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { MetricsService } from '../../core/services/metrics.service';
import { CommonModule } from '@angular/common'; // Already here
import { Router } from '@angular/router'; // <-- Import Router

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  // Inject the Router service
  constructor(
    private metricsService: MetricsService,
    private router: Router // <-- Inject Router
  ) {}

  ngOnInit(): void {
    this.metricsService.getAdminMetrics().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching admin metrics:', err);
        this.loading = false;
        // Handle error, maybe show a message to the user
      },
    });
  }

  // --- Button Click Handlers ---

  onViewAllPendingBookings(): void {
    alert('Navigating to pending bookings...');
    // Example: Navigate to a bookings management page, possibly with a filter
    this.router.navigate(['/admin/bookings'], {
      queryParams: { status: 'pending' },
    });
  }

  onViewAllOpenIssues(): void {
    alert('Navigating to open issues...');
    // Example: Navigate to a vehicle issues page
    this.router.navigate(['/admin/issues']);
  }

  onViewAllUsers(): void {
    alert('Navigating to user management...');
    // Example: Navigate to a user management page
    this.router.navigate(['/admin/users']);
  }

  onAddNewVehicle(): void {
  alert('Navigating to add new vehicle form...');
    this.router.navigate(['../vehicles/vehicle-list']);
  }

  onManageAgents(): void {
    alert('Navigating to agent management...');
    this.router.navigate(['../agents']);
  }

  onSendNotification(): void {
    alert('Opening send notification modal/page...');
    alert('Send Notification functionality would go here!');
    this.router.navigate(['../../notifications']);
  }

  onViewDetailedReports(): void {
    alert('Navigating to detailed reports...');
    this.router.navigate(['/admin/reports']);
  }
}
