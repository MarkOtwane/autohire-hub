import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupportService {
  constructor(private http: HttpClient) {}

  createTicket(data: { subject: string; message: string }): Observable<any> {
    return this.http.post('/support', data);
  }

  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>('/support/my');
  }
}
