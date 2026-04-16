import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  validateConflict(data: {
    vehicleId: string;
    pickupDate: string;
    dropoffDate: string;
    excludeBookingId?: string;
  }): Observable<{
    hasConflict: boolean;
    conflictingBookingId: string | null;
  }> {
    return this.http.post<{
      hasConflict: boolean;
      conflictingBookingId: string | null;
    }>(`${this.baseUrl}/validate-conflict`, data);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
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
}
