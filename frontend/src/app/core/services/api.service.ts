import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }

  post<T>(url: string, data: any) {
    return this.http.post<T>(url, data);
  }

  patch<T>(url: string, data: any) {
    return this.http.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }
}


