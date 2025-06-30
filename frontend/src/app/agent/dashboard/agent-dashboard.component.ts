import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  imports: [CommonModule]
})
export class AgentDashboardComponent implements OnInit {
  dashboardData: any;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService
      .getDashboard()
      .subscribe((data) => (this.dashboardData = data));
  }
}
