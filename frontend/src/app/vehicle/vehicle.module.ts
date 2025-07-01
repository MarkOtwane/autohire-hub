// src/app/vehicles/vehicles.module.ts

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VehiclesRoutingModule } from './vehicle.routing';

@NgModule({
  declarations: [], // Standalone components are not declared in NgModules
  imports: [CommonModule, VehiclesRoutingModule],
})
export class VehiclesModule {}
