import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
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
