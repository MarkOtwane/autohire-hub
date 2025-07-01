import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { SupportRoutingModule } from './support-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SupportRoutingModule,
  ],
})
export class SupportModule {}
