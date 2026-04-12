// src/app/admin/admin.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { VehiclesRoutingModule } from './vehicles/vehicles-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    VehiclesRoutingModule
  ],
})
export class AdminModule {}
