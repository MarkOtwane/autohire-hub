import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingsRoutingModule } from './bookings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingsListComponent } from './bookings-list/bookings-list.component';

@NgModule({
  declarations: [BookingsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BookingsRoutingModule,
  ],
})
export class BookingsModule {}
