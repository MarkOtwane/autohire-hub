import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  imports: [CommonModule],
})
export class NotificationCenterComponent implements OnInit {
  notifications: any[] = [];
  loading = true;
  error = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.error = '';

    this.notificationService.getUserNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load notifications. Please try again.';
        this.loading = false;
      },
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  get totalCount(): number {
    return this.notifications.length;
  }

  get unreadCount(): number {
    return this.notifications.filter((item) => !item.read).length;
  }

  get readCount(): number {
    return this.notifications.filter((item) => item.read).length;
  }
}
