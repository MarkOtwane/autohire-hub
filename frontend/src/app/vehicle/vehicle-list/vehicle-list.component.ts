// src/app/components/vehicle-list/vehicle-list.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchVehicleParams, Vehicle } from '../vehicle.model';
import { VehicleService } from './vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // HttpClientModule is needed here for the service
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading: boolean = true;
  error: string | null = null;
  calendarLoading: Record<string, boolean> = {};
  calendarSummary: Record<string, string> = {};

  readonly categories: Array<SearchVehicleParams['category']> = [
    '',
    'SUV',
    'SEDAN',
    'ECONOMY',
    'LUXURY',
    'PICKUP',
    'VAN',
  ];

  readonly fuelTypes: Array<SearchVehicleParams['fuelType']> = [
    '',
    'PETROL',
    'DIESEL',
    'ELECTRIC',
    'HYBRID',
  ];

  filters: SearchVehicleParams = {
    location: '',
    category: '',
    fuelType: '',
    transmission: '',
    minPricePerDay: null,
    maxPricePerDay: null,
    availableOnly: true,
    keyword: '',
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  /**
   * Loads all vehicles from the backend using the VehicleService.
   */
  loadVehicles(): void {
    this.loading = true;
    this.error = null;
    this.vehicleService.searchVehicles(this.filters).subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load vehicles:', err);
        this.error = 'Failed to load vehicles. Please try again later.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.loadVehicles();
  }

  resetFilters(): void {
    this.filters = {
      location: '',
      category: '',
      fuelType: '',
      transmission: '',
      minPricePerDay: null,
      maxPricePerDay: null,
      availableOnly: true,
      keyword: '',
    };
    this.loadVehicles();
  }

  checkAvailability(vehicle: Vehicle): void {
    this.calendarLoading[vehicle.id] = true;
    this.calendarSummary[vehicle.id] = '';

    this.vehicleService.getVehicleCalendar(vehicle.id).subscribe({
      next: (calendar) => {
        this.calendarSummary[vehicle.id] =
          calendar.blockedSlots.length === 0
            ? 'Available for the next 30 days'
            : `${calendar.blockedSlots.length} blocked slot(s) in the next 30 days`;
        this.calendarLoading[vehicle.id] = false;
      },
      error: () => {
        this.calendarSummary[vehicle.id] =
          'Could not load availability right now';
        this.calendarLoading[vehicle.id] = false;
      },
    });
  }

  /**
   * Placeholder for viewing vehicle details.
   * In a real app, this would navigate to a detail page.
   * @param vehicle The vehicle object to view.
   */
  viewDetails(vehicle: Vehicle): void {
    alert(`Viewing details for: ${vehicle.name} (ID: ${vehicle.id})`);
    // Implement Angular Router navigation here:
    // this.router.navigate(['/vehicles', vehicle.id]);
  }

  /**
   * Placeholder for booking a vehicle.
   * In a real app, this would navigate to a booking form or open a modal.
   * @param vehicle The vehicle object to book.
   */
  bookVehicle(vehicle: Vehicle): void {
    this.router.navigate(['/bookings/create', vehicle.id], {
      queryParams: {
        vehicleName: vehicle.name,
        pickupLocation: vehicle.location,
        returnLocation: vehicle.location,
      },
    });
  }

  startDigitalAgreement(vehicle: Vehicle): void {
    this.router.navigate(['/agreements/new'], {
      queryParams: {
        vehicleName: vehicle.name,
        pickupLocation: vehicle.location,
        returnLocation: vehicle.location,
      },
    });
  }

  // Removed editVehicle and deleteVehicle methods as they are not for user view
}
