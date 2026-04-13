import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateBookingComponent implements OnInit {
  form!: FormGroup;
  vehicleId = '';
  vehicleName = '';
  pickupLocation = '';
  returnLocation = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;
    this.vehicleName =
      this.route.snapshot.queryParamMap.get('vehicleName') || '';
    this.pickupLocation =
      this.route.snapshot.queryParamMap.get('pickupLocation') || '';
    this.returnLocation =
      this.route.snapshot.queryParamMap.get('returnLocation') || '';

    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      note: [''],
    });

    this.prefillDatesFromQuery();
  }

  startDigitalAgreement() {
    if (
      this.form.controls['startDate'].invalid ||
      this.form.controls['endDate'].invalid
    ) {
      this.form.markAllAsTouched();
      return;
    }

    this.router.navigate(['/agreements/new'], {
      queryParams: {
        source: 'booking',
        vehicleId: this.vehicleId,
        vehicleName: this.vehicleName || `Vehicle ${this.vehicleId}`,
        pickupDate: this.form.controls['startDate'].value,
        returnDate: this.form.controls['endDate'].value,
        pickupLocation: this.pickupLocation,
        returnLocation: this.returnLocation,
      },
    });
  }

  private prefillDatesFromQuery() {
    const query = this.route.snapshot.queryParamMap;
    const startDate = this.normalizeDate(
      query.get('startDate') || query.get('pickupDate'),
    );
    const endDate = this.normalizeDate(
      query.get('endDate') || query.get('returnDate'),
    );

    this.form.patchValue({
      startDate,
      endDate,
    });
  }

  private normalizeDate(value: string | null): string {
    if (!value) {
      return '';
    }

    const isoDate = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDate.test(value)) {
      return value;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toISOString().slice(0, 10);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const bookingData = {
      vehicleId: this.vehicleId,
      pickupDate: this.form.value.startDate,
      dropoffDate: this.form.value.endDate,
      options: {
        note: this.form.value.note,
      },
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => this.router.navigate(['/bookings/my-bookings']),
      error: () => (this.loading = false),
    });
  }
}
