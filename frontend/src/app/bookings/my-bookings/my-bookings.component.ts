import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  bookings: any[] = [];
  loading = true;
  error = '';
  success = '';
  private refreshTimer?: ReturnType<typeof setInterval>;

  constructor(private bookingService: BookingService) {}

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
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your bookings. Please refresh the page.';
        this.loading = false;
      },
    });
  }

  rebook(bookingId: string): void {
    this.error = '';
    this.success = '';
    this.bookingService.rebookBooking(bookingId).subscribe({
      next: () => {
        this.success = 'Booking re-created successfully.';
        this.loadBookings();
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          'Could not rebook right now. Please try different dates from details.';
      },
    });
  }

  get totalBookings(): number {
    return this.bookings.length;
  }

  get activeBookings(): number {
    return this.bookings.filter((booking) =>
      ['CONFIRMED', 'PENDING', 'IN_PROGRESS'].includes(
        String(booking?.status || '').toUpperCase(),
      ),
    ).length;
  }

  get completedBookings(): number {
    return this.bookings.filter(
      (booking) => String(booking?.status || '').toUpperCase() === 'COMPLETED',
    ).length;
  }

  get cancelledBookings(): number {
    return this.bookings.filter(
      (booking) => String(booking?.status || '').toUpperCase() === 'CANCELLED',
    ).length;
  }

  statusClass(status: string | undefined): string {
    const normalized = String(status || '').toUpperCase();

    if (normalized === 'CONFIRMED') return 'status-confirmed';
    if (normalized === 'PENDING') return 'status-pending';
    if (normalized === 'COMPLETED') return 'status-completed';
    if (normalized === 'CANCELLED') return 'status-cancelled';
    if (normalized === 'IN_PROGRESS') return 'status-in-progress';

    return 'status-default';
  }
}
