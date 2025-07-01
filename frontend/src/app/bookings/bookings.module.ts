import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingsRoutingModule } from './bookings-routing.module';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
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
