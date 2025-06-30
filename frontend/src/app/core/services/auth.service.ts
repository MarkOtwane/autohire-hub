import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api/auth'; // adjust to match proxy config

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
    this.router.navigate(['/auth/login']);
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

  getUserEmail(): string {
    return this.tokenService.decodeToken()?.email || '';
  }
}
