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

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService
      .getMyBookings()
      .subscribe((data) => (this.bookings = data));
  }
}
