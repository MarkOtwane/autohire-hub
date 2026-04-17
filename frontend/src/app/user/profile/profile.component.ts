import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormErrorComponent, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  dashboardLoading = true;
  profileError = '';
  saveMessage = '';

  profile: any = null;
  bookings: any[] = [];
  reviews: any[] = [];

  readonly quickActions = [
    {
      label: 'Browse vehicles',
      description: 'Find your next ride and start a booking.',
      action: () => this.router.navigate(['/vehicles']),
    },
    {
      label: 'View bookings',
      description: 'Check upcoming, active, and past rentals.',
      action: () => this.router.navigate(['/bookings/my-bookings']),
    },
    {
      label: 'Change password',
      description: 'Keep your account secure.',
      action: () => this.router.navigate(['/user/change-password']),
    },
    {
      label: 'View metrics',
      description: 'See your rental summary and review stats.',
      action: () => this.router.navigate(['/user/metrics']),
    },
  ];

  get totalBookings(): number {
    return this.bookings.length;
  }

  get activeBookings(): number {
    return this.bookings.filter((booking) =>
      ['PENDING', 'CONFIRMED'].includes(booking.status),
    ).length;
  }

  get totalSpent(): number {
    return this.bookings.reduce(
      (sum, booking) => sum + (Number(booking.totalAmount) || 0),
      0,
    );
  }

  get averageRating(): string {
    if (!this.reviews.length) {
      return 'N/A';
    }

    const average =
      this.reviews.reduce((sum, review) => sum + review.rating, 0) /
      this.reviews.length;
    return average.toFixed(1);
  }

  get profileCompletion(): number {
    if (!this.profile) {
      return 0;
    }

    const fields = [this.profile.name, this.profile.email, this.profile.phone];
    const filled = fields.filter((value) =>
      Boolean(value && `${value}`.trim()),
    ).length;
    return Math.round((filled / fields.length) * 100);
  }

  get nextBooking(): any | null {
    return (
      this.bookings
        .filter((booking) => ['PENDING', 'CONFIRMED'].includes(booking.status))
        .sort(
          (left, right) =>
            new Date(left.pickupDate).getTime() -
            new Date(right.pickupDate).getTime(),
        )[0] || null
    );
  }

  get latestBooking(): any | null {
    return (
      [...this.bookings].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      )[0] || null
    );
  }

  get bookingBreakdown() {
    const counts = this.bookings.reduce(
      (acc, booking) => {
        acc.total += 1;
        if (booking.status === 'PENDING') acc.pending += 1;
        if (booking.status === 'CONFIRMED') acc.confirmed += 1;
        if (booking.status === 'COMPLETED') acc.completed += 1;
        if (booking.status === 'CANCELLED') acc.cancelled += 1;
        return acc;
      },
      { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    );

    return [
      { label: 'Pending', value: counts.pending, tone: 'pending' },
      { label: 'Confirmed', value: counts.confirmed, tone: 'confirmed' },
      { label: 'Completed', value: counts.completed, tone: 'completed' },
      { label: 'Cancelled', value: counts.cancelled, tone: 'cancelled' },
    ];
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });

    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardLoading = true;
    this.profileError = '';

    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.form.patchValue(data);

        this.userService.getRentalHistory().subscribe({
          next: (bookings) => {
            this.bookings = bookings;

            this.userService.getMyReviews().subscribe({
              next: (reviews) => {
                this.reviews = reviews;
                this.dashboardLoading = false;
              },
              error: () => {
                this.reviews = [];
                this.dashboardLoading = false;
              },
            });
          },
          error: () => {
            this.bookings = [];
            this.dashboardLoading = false;
          },
        });
      },
      error: () => {
        this.profileError = 'Could not load your dashboard right now.';
        this.dashboardLoading = false;
      },
    });
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    this.saveMessage = '';

    this.userService.updateProfile(this.form.value).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.saveMessage = 'Profile updated successfully.';
        this.loading = false;
      },
      error: () => {
        this.saveMessage = 'Unable to save profile changes right now.';
        this.loading = false;
      },
    });
  }

  runAction(action: () => void): void {
    action();
  }
}
