// src/app/services/vehicle.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';
import { Vehicle } from '../vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all vehicles from the backend.
   * @returns An Observable of an array of Vehicle objects.
   */
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  /**
   * Fetches a single vehicle by its ID.
   * @param id The ID of the vehicle to fetch.
   * @returns An Observable of a single Vehicle object.
   */
  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }
}
