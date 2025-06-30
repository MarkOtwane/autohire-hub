import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly baseUrl = '/bookings';

  constructor(private http: HttpClient) {}

  createBooking(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getBookingById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>('/bookings/admin');
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.patch(`/bookings/admin/${id}/cancel`, {});
  }
}
