import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';import { BookingsRoutingModule } from './bookings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BookingsRoutingModule,
    RouterModule,
  ],
})
export class BookingsModule {}
