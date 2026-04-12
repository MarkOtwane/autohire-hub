import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgreementService } from '../../core/services/agreement.service';

@Component({
  selector: 'app-agreement-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agreement-success.component.html',
  styleUrls: ['./agreement-success.component.css'],
})
export class AgreementSuccessComponent {
  agreementId = '';
  downloadUrl = '';
  showContinueToBooking = false;
  continueBookingLink: string[] = ['/'];
  continueBookingQueryParams: Record<string, string> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly agreementService: AgreementService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.agreementId = params.get('agreementId') || '';
      const rawUrl = params.get('downloadUrl') || '';
      this.downloadUrl = rawUrl
        ? this.agreementService.getPdfUrl(decodeURIComponent(rawUrl))
        : '';

      const source = params.get('source') || '';
      const vehicleId = params.get('vehicleId') || '';
      this.showContinueToBooking = source === 'booking' && !!vehicleId;

      if (this.showContinueToBooking) {
        this.continueBookingLink = ['/bookings/create', vehicleId];
        this.continueBookingQueryParams = {
          vehicleName: params.get('vehicleName') || '',
          pickupLocation: params.get('pickupLocation') || '',
          returnLocation: params.get('returnLocation') || '',
          startDate: params.get('pickupDate') || '',
          endDate: params.get('returnDate') || '',
        };
      }
    });
  }
}
