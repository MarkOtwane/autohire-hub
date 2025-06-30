import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';



@Component({
  selector: 'app-vehicle-create',
  templateUrl: './vehicle-create.component.html',
  styleUrls: ['./vehicle-create.component.scss'],
})
export class VehicleCreateComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.form = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      status: ['AVAILABLE', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.vehicleService.createVehicle(this.form.value).subscribe(() => {
        this.router.navigate(['/admin/vehicles']);
      });
    }
  }
}
