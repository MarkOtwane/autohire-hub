import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-bookings',
  templateUrl: './agent-bookings.component.html',
  imports: [CommonModule],
})
export class AgentBookingsComponent implements OnInit, OnDestroy {
  bookings: any[] | null = null;
  loading = true;
  error = '';
  private refreshTimer?: ReturnType<typeof setInterval>;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.loadBookings();
    this.refreshTimer = setInterval(() => this.loadBookings(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';

    this.agentService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not refresh bookings right now.';
        this.loading = false;
        this.bookings = [];
      },
    });
  }
}
