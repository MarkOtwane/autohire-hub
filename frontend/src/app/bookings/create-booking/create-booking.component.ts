import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
})
export class CreateBookingComponent implements OnInit {
  form!: FormGroup;
  vehicleId = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      note: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const bookingData = {
      vehicleId: this.vehicleId,
      ...this.form.value,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => this.router.navigate(['/bookings/my-bookings']),
      error: () => (this.loading = false),
    });
  }
}
