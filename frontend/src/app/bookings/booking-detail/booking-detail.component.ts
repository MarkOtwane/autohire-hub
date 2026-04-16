import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class BookingDetailComponent implements OnInit {
  booking: any;
  timeline: Array<{
    code: string;
    title: string;
    description: string;
    timestamp: string;
    isEstimated: boolean;
  }> = [];
  timelineError = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.bookingService.getBookingById(id).subscribe((data) => {
      this.booking = data;
    });

    this.bookingService.getBookingTimeline(id).subscribe({
      next: (response) => {
        this.timeline = response.timeline ?? [];
      },
      error: () => {
        this.timelineError = 'Could not load booking timeline.';
      },
    });
  }
}
