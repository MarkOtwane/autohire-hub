import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss'],
})
export class VehicleEditComponent implements OnInit {
  form = this.fb.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    status: ['', Validators.required],
  });

  vehicleId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.vehicleService.getVehicleById(this.vehicleId).subscribe((vehicle) => {
      this.form.patchValue(vehicle);
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.vehicleService
        .updateVehicle(this.vehicleId, this.form.value)
        .subscribe(() => {
          this.router.navigate(['/admin/vehicles']);
        });
    }
  }
}
