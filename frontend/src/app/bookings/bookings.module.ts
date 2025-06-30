import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';import { BookingsRoutingModule } from './bookings-routing.module';
import { SharedModule } from '../shared/shared.module';
;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BookingsRoutingModule,
  ],
})
export class BookingsModule {}
