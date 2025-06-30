import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';

@Component({
  selector: 'app-agent-metrics',
  templateUrl: './agent-metrics.component.html',
})
export class AgentMetricsComponent implements OnInit {
  metrics: any;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.getMetrics().subscribe((data) => (this.metrics = data));
  }
}
