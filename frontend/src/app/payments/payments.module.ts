import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PaymentsRoutingModule } from './payments-routing.module';
import { SimulatePaymentComponent } from './simulate-payment/simulate-payment.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PaymentsRoutingModule,
  ],
})
export class PaymentsModule {}
