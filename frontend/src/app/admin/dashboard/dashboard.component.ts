// src/app/admin/dashboard/dashboard.component.ts

import { CommonModule } from '@angular/common'; // Already here
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- Import Router
import { AuthService } from '../../core/services/auth.service';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = true;
  sidebarCollapsed = false;
  profileMenuOpen = false;
  userRole = 'ADMIN';
  userName = 'Administrator';

  readonly sidebarLinks = [
    { label: 'Overview', route: '/admin', icon: 'fa-chart-pie' },
    { label: 'Vehicles', route: '/admin/vehicles', icon: 'fa-car-side' },
    { label: 'Bookings', route: '/admin/bookings', icon: 'fa-calendar-check' },
    { label: 'Agents', route: '/admin/agents', icon: 'fa-user-shield' },
    { label: 'Users', route: '/admin/users', icon: 'fa-users' },
    {
      label: 'Issues',
      route: '/admin/issues',
      icon: 'fa-triangle-exclamation',
    },
    {
      label: 'Notifications',
      route: '/admin/notifications',
      icon: 'fa-bell',
    },
  ];

  // Inject the Router service
  constructor(
    private metricsService: MetricsService,
    private router: Router, // <-- Inject Router
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'ADMIN';
    this.userName = this.authService.getUserEmail() || 'Administrator';

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
    this.router.navigate(['/admin/bookings'], {
      queryParams: { status: 'pending' },
    });
  }

  onViewAllOpenIssues(): void {
    this.router.navigate(['/admin/issues']);
  }

  onViewAllUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  onAddNewVehicle(): void {
    this.router.navigate(['/admin/vehicles/create']);
  }

  onManageAgents(): void {
    this.router.navigate(['../agents']);
  }

  onSendNotification(): void {
    this.router.navigate(['/admin/notifications']);
  }

  onViewDetailedReports(): void {
    this.router.navigate(['/metrics']);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  navigate(route: string): void {
    this.closeProfileMenu();
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(`${route}/`);
  }

  logout(): void {
    this.closeProfileMenu();
    this.authService.logout();
  }
}
