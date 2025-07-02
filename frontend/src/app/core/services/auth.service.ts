import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/admin';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        this.tokenService.setToken(res.access_token);
      })
    );
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserRole(): string {
    return this.tokenService.decodeToken()?.role || '';
  }

  getUserId(): string {
    return this.tokenService.decodeToken()?.sub || '';
  }
  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post('auth/forgot-password', data);
  }

  getUserEmail(): string {
    return this.tokenService.decodeToken()?.email || '';
  }
  register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post('auth/register', data);
  }
  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post('auth/reset-password', data);
  }
}
