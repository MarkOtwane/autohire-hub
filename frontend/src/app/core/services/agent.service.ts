import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly baseUrl = '/agent';

  constructor(private http: HttpClient) {}

  /**
   * GET /agent/dashboard
   */
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  /**
   * GET /agent/bookings
   */
  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookings`);
  }

  /**
   * GET /agent/metrics
   */
  getMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics`);
  }

  getAllAgents(): Observable<any[]> {
    return this.http.get<any[]>('/agents/admin');
  }

  approveAgent(id: string): Observable<any> {
    return this.http.patch(`/agents/admin/${id}/approve`, {});
  }

  suspendAgent(id: string): Observable<any> {
    return this.http.patch(`/agents/admin/${id}/suspend`, {});
  }

  /**
   * (Optional) Update booking status
   */
  updateBookingStatus(bookingId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/bookings/${bookingId}`, { status });
  }
}
