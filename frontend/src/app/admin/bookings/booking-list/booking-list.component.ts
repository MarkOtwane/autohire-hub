import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  imports: [CommonModule],
})
export class BookingsListComponent implements OnInit, OnDestroy {
  bookings: any[] = [];
  loading = true;
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
    this.bookingService.getAllBookings().subscribe((data) => {
      this.bookings = data;
      this.loading = false;
    });
  }

  cancelBooking(id: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe(() => {
        this.bookings = this.bookings.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' } : b,
        );
      });
    }
  }
}
