import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private backendBaseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getAdminMetrics(): Observable<any> {
    return this.http.get(`${this.backendBaseUrl}/metrics/admin`);
  }

  getAgentMetrics(): Observable<any> {
    return this.http.get(`${this.backendBaseUrl}/metrics/agent`);
  }
}
