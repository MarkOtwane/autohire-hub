import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  imports: [CommonModule]
})
export class VehicleListComponent implements OnInit {
  vehicles: any[] = [];
  loading = true;

  constructor(private vehicleService: VehicleService, private router: Router) {}

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe((data) => {
      this.vehicles = data;
      this.loading = false;
    });
  }

  deleteVehicle(id: string): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe(() => {
        this.vehicles = this.vehicles.filter((v) => v.id !== id);
      });
    }
  }

  editVehicle(id: string): void {
    this.router.navigate(['/admin/vehicles/edit', id]);
  }
}
