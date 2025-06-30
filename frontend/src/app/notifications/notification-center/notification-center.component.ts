import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  imports: [CommonModule],
})
export class NotificationCenterComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getUserNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }
}
