import { Component, OnInit } from '@angular/core';
import { AgentService } from '../../core/services/agent.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-metrics',
  templateUrl: './agent-metrics.component.html',
  imports: [CommonModule]
})
export class AgentMetricsComponent implements OnInit {
  metrics: any;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.getMetrics().subscribe((data) => (this.metrics = data));
  }
}
