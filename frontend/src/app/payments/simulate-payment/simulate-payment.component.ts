import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-simulate-payment',
  templateUrl: './simulate-payment.component.html',
  styleUrls: ['./simulate-payment.component.scss'],
})
export class SimulatePaymentComponent implements OnInit {
  form!: FormGroup;
  bookingId = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId')!;
    this.form = this.fb.group({
      paymentMethod: ['CARD', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      reference: [''],
    });
  }

  simulate() {
    if (this.form.invalid) return;

    this.loading = true;
    const data = { bookingId: this.bookingId, ...this.form.value };

    this.paymentService.simulatePayment(data).subscribe({
      next: () => this.router.navigate(['/bookings/my-bookings']),
      error: () => (this.loading = false),
    });
  }
}
