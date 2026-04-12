import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-create',
  templateUrl: './vehicle-create.component.html',
  styleUrls: ['./vehicle-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class VehicleCreateComponent {
  form;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['SEDAN', Validators.required],
      pricePerDay: [0, [Validators.required, Validators.min(0)]],
      pricePerHour: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      transmission: ['AUTOMATIC', Validators.required],
      fuelType: ['PETROL', Validators.required],
      availability: [true],
      features: [[]],
      imageUrl: [''],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.vehicleService.createVehicle(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/vehicles']);
        },
        error: (error) => {
          console.error('Error creating vehicle:', error);
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/vehicles']);
  }
}
