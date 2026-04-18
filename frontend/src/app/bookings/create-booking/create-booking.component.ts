import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BookingAvailabilityCalendar,
  BookingAvailabilitySlot,
  BookingCalendarDay,
} from '../../core/models/booking.model';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateBookingComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  vehicleId = '';
  vehicleName = '';
  pickupLocation = '';
  returnLocation = '';
  loading = false;
  availabilityLoading = true;
  conflictError = '';
  availabilityError = '';
  availabilitySummary = '';
  selectedStartDate = '';
  selectedEndDate = '';
  calendarDays: BookingCalendarDay[] = [];
  private blockedSlots: BookingAvailabilitySlot[] = [];
  private refreshTimer?: ReturnType<typeof setInterval>;
  private readonly availabilityWindowDays = 60;

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
    this.loadAvailability();
    this.refreshTimer = setInterval(() => this.loadAvailability(false), 20000);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  startDigitalAgreement() {
    if (!this.hasValidSelection()) {
      this.form.markAllAsTouched();
      return;
    }

    this.router.navigate(['/agreements/new'], {
      queryParams: {
        source: 'booking',
        vehicleId: this.vehicleId,
        vehicleName: this.vehicleName || `Vehicle ${this.vehicleId}`,
        pickupDate: this.selectedStartDate,
        returnDate: this.selectedEndDate,
        pickupLocation: this.pickupLocation,
        returnLocation: this.returnLocation,
      },
    });
  }

  selectDate(date: string): void {
    if (!this.isSelectable(date)) {
      return;
    }

    if (!this.selectedStartDate || this.selectedEndDate) {
      this.selectedStartDate = date;
      this.selectedEndDate = '';
      this.form.patchValue({ startDate: date, endDate: '' });
      this.conflictError = '';
      this.refreshCalendarDays();
      return;
    }

    if (date < this.selectedStartDate) {
      this.selectedStartDate = date;
      this.form.patchValue({ startDate: date, endDate: '' });
      this.conflictError = '';
      this.refreshCalendarDays();
      return;
    }

    if (!this.isRangeAvailable(this.selectedStartDate, date)) {
      this.conflictError = 'Selected range overlaps an unavailable date.';
      return;
    }

    this.selectedEndDate = date;
    this.form.patchValue({ startDate: this.selectedStartDate, endDate: date });
    this.refreshCalendarDays();
    this.validateSelectedRange();
  }

  clearSelection(): void {
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.conflictError = '';
    this.form.patchValue({ startDate: '', endDate: '' });
    this.refreshCalendarDays();
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

    this.selectedStartDate = startDate;
    this.selectedEndDate = endDate;
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

  submit(): void {
    if (!this.hasValidSelection()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.conflictError = '';

    const bookingData = {
      vehicleId: this.vehicleId,
      pickupDate: this.selectedStartDate,
      dropoffDate: this.selectedEndDate,
      options: {
        note: this.form.value.note,
      },
    };

    this.bookingService
      .validateConflict({
        vehicleId: bookingData.vehicleId,
        pickupDate: bookingData.pickupDate,
        dropoffDate: bookingData.dropoffDate,
      })
      .subscribe({
        next: (result) => {
          if (result.hasConflict) {
            this.conflictError =
              'Selected dates are not available. Please choose a different range.';
            this.loading = false;
            return;
          }

          this.bookingService.createBooking(bookingData).subscribe({
            next: () => this.router.navigate(['/bookings/my-bookings']),
            error: () => (this.loading = false),
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  get selectedRangeLabel(): string {
    if (!this.selectedStartDate || !this.selectedEndDate) {
      return 'Choose a pickup and dropoff date to continue.';
    }

    return `${this.selectedStartDate} to ${this.selectedEndDate}`;
  }

  isSelectable(date: string): boolean {
    const currentState = this.getDateState(date);

    if (!this.selectedStartDate || this.selectedEndDate) {
      return currentState.isSelectable;
    }

    if (date < this.selectedStartDate) {
      return currentState.isSelectable;
    }

    return this.isRangeAvailable(this.selectedStartDate, date);
  }

  isStartDate(date: string): boolean {
    return date === this.selectedStartDate;
  }

  isEndDate(date: string): boolean {
    return date === this.selectedEndDate;
  }

  isInSelectedRange(date: string): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) {
      return false;
    }

    return date >= this.selectedStartDate && date <= this.selectedEndDate;
  }

  private loadAvailability(revalidateSelection = true): void {
    const from = this.todayUtcDateString();
    const to = this.addDays(from, this.availabilityWindowDays - 1);

    this.availabilityLoading = true;
    this.availabilityError = '';

    this.bookingService.getVehicleCalendar(this.vehicleId, from, to).subscribe({
      next: (calendar) => {
        this.applyCalendar(calendar);
        this.availabilityLoading = false;

        if (revalidateSelection) {
          this.validateSelectedRange();
        }
      },
      error: () => {
        this.availabilityError =
          'Could not load availability right now. Please refresh the page.';
        this.availabilityLoading = false;
      },
    });
  }

  private applyCalendar(calendar: BookingAvailabilityCalendar): void {
    this.blockedSlots = calendar.blockedSlots ?? [];
    this.refreshCalendarDays();
  }

  private refreshCalendarDays(): void {
    const blockedDates = this.getBlockedDates();

    this.availabilitySummary =
      this.blockedSlots.length === 0
        ? 'Available for the next 60 days.'
        : `${this.blockedSlots.length} blocked booking range(s) in the next 60 days.`;

    const days: BookingCalendarDay[] = [];

    for (let index = 0; index < this.availabilityWindowDays; index += 1) {
      const date = this.addDays(this.todayUtcDateString(), index);
      const state = this.getDateState(date, blockedDates);

      days.push({
        date,
        weekday: new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          timeZone: 'UTC',
        }).format(this.utcDate(date)),
        label: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(this.utcDate(date)),
        isToday: date === this.todayUtcDateString(),
        isPast: state.isPast,
        isBlocked: state.isBlocked,
        isInSelectedRange: this.isInSelectedRange(date),
        isStartDate: this.isStartDate(date),
        isEndDate: this.isEndDate(date),
        isSelectable: state.isSelectable,
      });
    }

    this.calendarDays = days;
  }

  private getBlockedDates(blockedSlots = this.blockedSlots): Set<string> {
    const dates = new Set<string>();

    for (const slot of blockedSlots) {
      let current = this.normalizeDate(slot.pickupDate);
      const endExclusive = this.normalizeDate(slot.dropoffDate);

      while (current < endExclusive) {
        dates.add(current);
        current = this.addDays(current, 1);
      }
    }

    return dates;
  }

  private getDateState(
    date: string,
    blockedDates = this.getBlockedDates(),
  ): { isPast: boolean; isBlocked: boolean; isSelectable: boolean } {
    const isPast = date < this.todayUtcDateString();
    const isBlocked = blockedDates.has(date);

    return {
      isPast,
      isBlocked,
      isSelectable: !isPast && !isBlocked,
    };
  }

  private validateSelectedRange(): void {
    if (!this.hasValidSelection()) {
      return;
    }

    this.bookingService
      .validateConflict({
        vehicleId: this.vehicleId,
        pickupDate: this.selectedStartDate,
        dropoffDate: this.selectedEndDate,
      })
      .subscribe({
        next: (result) => {
          this.conflictError = result.hasConflict
            ? 'Selected dates are not available. Please choose a different range.'
            : '';
        },
        error: () => {
          this.conflictError =
            'Could not validate the selected range right now. Please try again.';
        },
      });
  }

  private hasValidSelection(): boolean {
    return Boolean(this.selectedStartDate && this.selectedEndDate);
  }

  private isRangeAvailable(startDate: string, endDate: string): boolean {
    const blockedDates = this.getBlockedDates();
    let current = startDate;

    while (current <= endDate) {
      if (blockedDates.has(current) || current < this.todayUtcDateString()) {
        return false;
      }

      current = this.addDays(current, 1);
    }

    return true;
  }

  private todayUtcDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private utcDate(dateString: string): Date {
    return new Date(`${dateString}T00:00:00.000Z`);
  }

  private addDays(dateString: string, days: number): string {
    const date = this.utcDate(dateString);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }
}
