import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<any[]> {
    return this.http.get<any[]>('/notifications');
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`/notifications/${notificationId}/read`, {});
  }
}
