import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import {
  BookingAvailabilityCalendar,
  BookingConflictCheckResult,
  BookingUpdatePayload,
} from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/bookings`;
  private readonly vehiclesBaseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  createBooking(data: BookingUpdatePayload): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  validateConflict(data: {
    vehicleId: string;
    pickupDate: string;
    dropoffDate: string;
    excludeBookingId?: string;
  }): Observable<BookingConflictCheckResult> {
    return this.http.post<BookingConflictCheckResult>(
      `${this.baseUrl}/validate-conflict`,
      data,
    );
  }

  getVehicleCalendar(
    vehicleId: string,
    from?: string,
    to?: string,
  ): Observable<BookingAvailabilityCalendar> {
    const params: Record<string, string> = {};

    if (from) params['from'] = from;
    if (to) params['to'] = to;

    return this.http.get<BookingAvailabilityCalendar>(
      `${this.vehiclesBaseUrl}/${vehicleId}/calendar`,
      { params },
    );
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateBooking(id: string, data: BookingUpdatePayload): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  getBookingTimeline(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/timeline`);
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/bookings`);
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/cancel`, {});
  }

  rebookBooking(
    id: string,
    data?: {
      pickupDate?: string;
      dropoffDate?: string;
      options?: Record<string, unknown>;
    },
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/rebook`, data ?? {});
  }
}
