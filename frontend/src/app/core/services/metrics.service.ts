import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(private http: HttpClient) {}

  getAdminMetrics(): Observable<any> {
    return this.http.get('/metrics/admin');
  }

  getAgentMetrics(): Observable<any> {
    return this.http.get('/metrics/agent');
  }
}
