import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

export interface AgreementPayload {
  clientSubmissionId: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  driverIdNumber: string;
  driverLicenseNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  vehicleName: string;
  vehiclePlateNumber?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  rentalTermsAccepted: boolean;
  signatureData: string;
}

export interface AgreementResponse {
  success: boolean;
  duplicated?: boolean;
  agreementId: string;
  createdAt: string;
  downloadUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AgreementService {
  private readonly baseUrl = `${environment.apiUrl}/api/agreements`;

  constructor(private readonly http: HttpClient) {}

  submitAgreement(payload: AgreementPayload): Observable<AgreementResponse> {
    return this.http.post<AgreementResponse>(this.baseUrl, payload);
  }

  getPdfUrl(downloadPath: string): string {
    if (
      downloadPath.startsWith('http://') ||
      downloadPath.startsWith('https://')
    ) {
      return downloadPath;
    }
    return `${environment.apiUrl}${downloadPath}`;
  }
}
