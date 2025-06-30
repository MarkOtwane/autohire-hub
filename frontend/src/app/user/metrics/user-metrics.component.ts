import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-metrics',
  templateUrl: './user-metrics.component.html',
  styleUrls: ['./user-metrics.component.scss'],
})
export class UserMetricsComponent implements OnInit {
  metrics: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService
      .getUserMetrics()
      .subscribe((data) => (this.metrics = data));
  }
}
