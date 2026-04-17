import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/vehicles');
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`/vehicles/${id}`);
  }

  createVehicle(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>('/vehicles', data);
  }

  updateVehicle(id: string, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`/vehicles/${id}`, data);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`/vehicles/${id}`);
  }
}
