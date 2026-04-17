import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class VehicleEditComponent implements OnInit {
  vehicleId!: string;
  form: FormGroup;
  loading = false;
  initialLoading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router,
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
      featuresText: [''],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.loadVehicle();
  }

  loadVehicle(): void {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (vehicle) => {
        this.form.patchValue({
          ...vehicle,
          featuresText: vehicle.features?.join(', ') || '',
        });
        this.initialLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicle:', error);
        this.initialLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.vehicleService
        .updateVehicle(this.vehicleId, this.buildPayload())
        .subscribe({
          next: () => {
            this.router.navigate(['/admin/vehicles']);
          },
          error: (error) => {
            console.error('Error updating vehicle:', error);
            this.loading = false;
          },
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/vehicles']);
  }

  get imagePreview(): string {
    return (
      this.form.get('imageUrl')?.value ||
      'https://via.placeholder.com/420x220?text=Vehicle+Preview'
    );
  }

  private buildPayload(): Partial<Vehicle> {
    const { featuresText, ...rest } = this.form.getRawValue();
    const features = (featuresText || '')
      .split(',')
      .map((feature: string) => feature.trim())
      .filter((feature: string) => !!feature);

    return {
      name: rest.name ?? '',
      description: rest.description ?? '',
      category: (rest.category ?? 'SEDAN') as Vehicle['category'],
      pricePerDay: Number(rest.pricePerDay ?? 0),
      pricePerHour: Number(rest.pricePerHour ?? 0),
      location: rest.location ?? '',
      transmission: rest.transmission ?? 'AUTOMATIC',
      fuelType: (rest.fuelType ?? 'PETROL') as Vehicle['fuelType'],
      availability: !!rest.availability,
      imageUrl: rest.imageUrl ?? '',
      features,
    };
  }
}
