import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-bookings',
  templateUrl: './agent-bookings.component.html',
  imports: [CommonModule]
})
export class AgentBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private agentService: AgentService) { }
  

  ngOnInit(): void {
    this.agentService.getBookings().subscribe((data) => (this.bookings = data));
  }
}
