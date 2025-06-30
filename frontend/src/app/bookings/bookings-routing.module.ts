import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'create/:vehicleId',
    component: CreateBookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail/:id',
    component: BookingDetailComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}
