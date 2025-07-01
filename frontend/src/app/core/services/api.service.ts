import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { headers } from 'next/headers';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }

  post<T>(url: string, data: any) {
    return this.http.post<T>(url, data, { 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  patch<T>(url: string, data: any) {
    return this.http.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }
}


