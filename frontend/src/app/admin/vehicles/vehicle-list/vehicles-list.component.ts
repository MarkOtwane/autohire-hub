import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  errorMessage = '';
  readonly placeholderImage =
    'https://via.placeholder.com/120x80?text=No+Image';

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load vehicles right now. Please try again.';
        this.loading = false;
      },
    });
  }

  deleteVehicle(id: string): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter((v) => v.id !== id);
        },
        error: () => {
          this.errorMessage =
            'Unable to delete this vehicle. Please try again.';
        },
      });
    }
  }

  editVehicle(id: string): void {
    this.router.navigate(['/admin/vehicles/edit', id]);
  }

  trackByVehicleId(_: number, vehicle: Vehicle): string {
    return vehicle.id;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.placeholderImage;
  }
}
