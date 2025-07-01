import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<any[]> {
    return this.http.get<any[]>('/vehicles/admin');
  }

  getVehicleById(id: string): Observable<any> {
    return this.http.get<any>(`/vehicles/admin/${id}`);
  }

  createVehicle(data: any): Observable<any> {
    return this.http.post('/vehicles/admin', data);
  }

  updateVehicle(id: string, data: any): Observable<any> {
    return this.http.put(`/vehicles/admin/${id}`, data);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`/vehicles/admin/${id}`);
  }
}