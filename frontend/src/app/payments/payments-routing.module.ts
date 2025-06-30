import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatePaymentComponent } from './simulate-payment/simulate-payment.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'simulate/:bookingId',
    component: SimulatePaymentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
