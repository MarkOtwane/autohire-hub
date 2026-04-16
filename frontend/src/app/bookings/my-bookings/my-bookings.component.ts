import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  imports: [CommonModule, RouterModule],
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  error = '';
  success = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService
      .getMyBookings()
      .subscribe((data) => (this.bookings = data));
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
}
