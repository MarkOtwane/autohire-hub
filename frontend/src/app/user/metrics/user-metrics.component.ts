import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-metrics',
  templateUrl: './user-metrics.component.html',
  imports: [CommonModule],
})
export class UserMetricsComponent implements OnInit {
  metrics: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService
      .getUserMetrics()
      .subscribe((data: any) => (this.metrics = data));
  }
}
