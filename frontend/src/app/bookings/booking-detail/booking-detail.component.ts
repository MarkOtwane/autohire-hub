import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class BookingDetailComponent implements OnInit {
  booking: any;
  loading = true;
  bookingError = '';
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
    this.bookingService.getBookingById(id).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
      },
      error: () => {
        this.bookingError = 'Could not load booking details right now.';
        this.loading = false;
      },
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

  statusClass(status: string | undefined): string {
    const normalized = String(status || '').toUpperCase();

    if (normalized === 'CONFIRMED') return 'status-confirmed';
    if (normalized === 'PENDING') return 'status-pending';
    if (normalized === 'COMPLETED') return 'status-completed';
    if (normalized === 'CANCELLED') return 'status-cancelled';
    if (normalized === 'IN_PROGRESS') return 'status-progress';

    return 'status-default';
  }
}
