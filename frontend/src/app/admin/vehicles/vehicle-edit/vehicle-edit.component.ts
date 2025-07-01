import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class VehicleEditComponent implements OnInit {
 

  vehicleId!: string;
  form: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.form = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

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
