import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AgreementPayload,
  AgreementService,
} from '../../core/services/agreement.service';

@Component({
  selector: 'app-agreement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css'],
})
export class AgreementFormComponent implements AfterViewInit {
  @ViewChild('signatureCanvas')
  signatureCanvasRef!: ElementRef<HTMLCanvasElement>;

  readonly form;

  private canvasContext: CanvasRenderingContext2D | null = null;
  private drawing = false;
  signatureData = '';
  submitError = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly agreementService: AgreementService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      driverName: ['', Validators.required],
      driverEmail: ['', [Validators.required, Validators.email]],
      driverPhone: ['', Validators.required],
      driverIdNumber: ['', Validators.required],
      driverLicenseNumber: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
      vehicleName: ['', Validators.required],
      vehiclePlateNumber: [''],
      pickupDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      returnLocation: ['', Validators.required],
      rentalTermsAccepted: [false, Validators.requiredTrue],
    });

    this.applyPrefillValues();
  }

  ngAfterViewInit(): void {
    const canvas = this.signatureCanvasRef.nativeElement;
    this.resizeCanvas();
    this.canvasContext = canvas.getContext('2d');

    if (this.canvasContext) {
      this.canvasContext.lineWidth = 2;
      this.canvasContext.lineCap = 'round';
      this.canvasContext.strokeStyle = '#1f2937';
    }
  }

  onPointerDown(event: MouseEvent | TouchEvent) {
    this.drawing = true;
    const { x, y } = this.getCanvasCoordinates(event);
    this.canvasContext?.beginPath();
    this.canvasContext?.moveTo(x, y);
  }

  onPointerMove(event: MouseEvent | TouchEvent) {
    if (!this.drawing || !this.canvasContext) {
      return;
    }

    const { x, y } = this.getCanvasCoordinates(event);
    this.canvasContext.lineTo(x, y);
    this.canvasContext.stroke();
    this.signatureData =
      this.signatureCanvasRef.nativeElement.toDataURL('image/png');
  }

  onPointerUp() {
    this.drawing = false;
    this.canvasContext?.closePath();
    this.signatureData =
      this.signatureCanvasRef.nativeElement.toDataURL('image/png');
  }

  clearSignature() {
    const canvas = this.signatureCanvasRef.nativeElement;
    const context = this.canvasContext;
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.signatureData = '';
  }

  submit() {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.signatureData) {
      this.submitError = 'Signature is required before submission.';
      return;
    }

    this.loading = true;

    const payload: AgreementPayload = {
      clientSubmissionId: this.getSubmissionId(),
      driverName: this.form.controls.driverName.value || '',
      driverEmail: this.form.controls.driverEmail.value || '',
      driverPhone: this.form.controls.driverPhone.value || '',
      driverIdNumber: this.form.controls.driverIdNumber.value || '',
      driverLicenseNumber: this.form.controls.driverLicenseNumber.value || '',
      emergencyContactName: this.form.controls.emergencyContactName.value || '',
      emergencyContactPhone:
        this.form.controls.emergencyContactPhone.value || '',
      vehicleName: this.form.controls.vehicleName.value || '',
      vehiclePlateNumber: this.form.controls.vehiclePlateNumber.value || '',
      pickupDate: this.form.controls.pickupDate.value || '',
      returnDate: this.form.controls.returnDate.value || '',
      pickupLocation: this.form.controls.pickupLocation.value || '',
      returnLocation: this.form.controls.returnLocation.value || '',
      rentalTermsAccepted: !!this.form.controls.rentalTermsAccepted.value,
      signatureData: this.signatureData,
    };

    this.agreementService.submitAgreement(payload).subscribe({
      next: (result) => {
        this.loading = false;
        sessionStorage.removeItem('agreement_submission_id');

        const source = this.route.snapshot.queryParamMap.get('source') || '';
        const vehicleId =
          this.route.snapshot.queryParamMap.get('vehicleId') || '';

        this.router.navigate(['/agreements/success'], {
          queryParams: {
            agreementId: result.agreementId,
            downloadUrl: encodeURIComponent(result.downloadUrl),
            source,
            vehicleId,
            vehicleName: this.form.controls.vehicleName.value || '',
            pickupDate: this.form.controls.pickupDate.value || '',
            returnDate: this.form.controls.returnDate.value || '',
            pickupLocation: this.form.controls.pickupLocation.value || '',
            returnLocation: this.form.controls.returnLocation.value || '',
          },
        });
      },
      error: (error) => {
        this.loading = false;
        this.submitError =
          error?.error?.message ||
          'Unable to submit agreement. Please try again.';
      },
    });
  }

  private getSubmissionId(): string {
    const key = 'agreement_submission_id';
    const existing = sessionStorage.getItem(key);
    if (existing) {
      return existing;
    }

    const generated = crypto.randomUUID();
    sessionStorage.setItem(key, generated);
    return generated;
  }

  private resizeCanvas() {
    const canvas = this.signatureCanvasRef.nativeElement;
    const width = Math.min(canvas.parentElement?.clientWidth || 640, 640);
    canvas.width = width;
    canvas.height = 180;
  }

  private applyPrefillValues() {
    const query = this.route.snapshot.queryParamMap;

    const pickupDate = this.normalizeDate(query.get('pickupDate'));
    const returnDate = this.normalizeDate(query.get('returnDate'));

    this.form.patchValue({
      driverName: query.get('driverName') || '',
      driverEmail: query.get('driverEmail') || '',
      driverPhone: query.get('driverPhone') || '',
      vehicleName: query.get('vehicleName') || '',
      vehiclePlateNumber: query.get('vehiclePlateNumber') || '',
      pickupDate,
      returnDate,
      pickupLocation: query.get('pickupLocation') || '',
      returnLocation: query.get('returnLocation') || '',
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

  private getCanvasCoordinates(event: MouseEvent | TouchEvent) {
    const canvas = this.signatureCanvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof TouchEvent) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
