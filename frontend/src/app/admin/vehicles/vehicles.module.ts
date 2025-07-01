import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { VehicleCreateComponent } from './vehicle-create/vehicle-create.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { VehicleListComponent } from './vehicle-list/vehicles-list.component';
import { VehiclesRoutingModule } from './vehicles-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    VehiclesRoutingModule,
    VehicleCreateComponent,
    VehicleListComponent,
    VehicleEditComponent,
  ],
})
export class VehiclesModule {}
