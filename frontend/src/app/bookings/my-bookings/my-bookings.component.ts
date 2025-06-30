import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService
      .getMyBookings()
      .subscribe((data) => (this.bookings = data));
  }
}
