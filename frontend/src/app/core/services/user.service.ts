import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Fetch current user's profile
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // Update user profile
  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, data);
  }

  // Update password
  updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.apiUrl}/me/password`,
      data
    );
  }

  // Fetch user's rental history (bookings)
  getRentalHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/me/bookings`);
  }

  // Get user reviews
  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/me/reviews`);
  }

  getUserMetrics(): Observable<any> {
    return this.http.get('/api/user/metrics');
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post('/api/user/change-password', data);
  }

  // Optionally: submit a new review
  submitReview(
    vehicleId: string,
    content: string,
    rating: number
  ): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/me/reviews`, {
      vehicleId,
      content,
      rating,
    });
  }
}
