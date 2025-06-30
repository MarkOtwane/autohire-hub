import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class BookingDetailComponent implements OnInit {
  booking: any;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.bookingService
      .getBookingById(id)
      .subscribe((data) => (this.booking = data));
  }
}
