import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserMetricsComponent } from './metrics/user-metrics.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    UserMetricsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
