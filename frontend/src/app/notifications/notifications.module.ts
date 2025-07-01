import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotificationCenterComponent } from './notification-center/notification-center.component';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
  ],
})
export class NotificationsModule {}
