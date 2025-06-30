import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
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
