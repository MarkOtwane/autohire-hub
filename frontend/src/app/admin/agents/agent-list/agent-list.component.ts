import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/core/services/agent.service';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss'],
})
export class AgentsListComponent implements OnInit {
  agents: any[] = [];
  loading = true;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.getAllAgents().subscribe((data) => {
      this.agents = data;
      this.loading = false;
    });
  }

  approve(id: string): void {
    this.agentService.approveAgent(id).subscribe(() => {
      this.updateStatus(id, 'APPROVED');
    });
  }

  suspend(id: string): void {
    this.agentService.suspendAgent(id).subscribe(() => {
      this.updateStatus(id, 'SUSPENDED');
    });
  }

  private updateStatus(id: string, status: string): void {
    this.agents = this.agents.map((a) => (a.id === id ? { ...a, status } : a));
  }
}
