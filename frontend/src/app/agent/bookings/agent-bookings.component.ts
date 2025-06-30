import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';

@Component({
  selector: 'app-agent-bookings',
  templateUrl: './agent-bookings.component.html',
})
export class AgentBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.getBookings().subscribe((data) => (this.bookings = data));
  }
}
