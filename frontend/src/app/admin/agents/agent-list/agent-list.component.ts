import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AgentsListComponent implements OnInit {
  agents: any[] = [];
  loading = true;

  constructor(private agentService: AgentService, private router: Router) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.loading = true;
    this.agentService.getAllAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
        this.loading = false;
      },
    });
  }

  editAgent(id: string): void {
    this.router.navigate(['/admin/agents/edit', id]);
  }

  deleteAgent(id: string): void {
    if (
      confirm(
        'Are you sure you want to delete this agent? This action cannot be undone.'
      )
    ) {
      this.agentService.deleteAgent(id).subscribe({
        next: () => {
          this.agents = this.agents.filter((a) => a.id !== id);
        },
        error: (error) => {
          console.error('Error deleting agent:', error);
          alert('Failed to delete agent. Please try again.');
        },
      });
    }
  }

  approve(id: string): void {
    this.agentService.approveAgent(id).subscribe({
      next: () => {
        this.updateStatus(id, 'APPROVED');
      },
      error: (error) => {
        console.error('Error approving agent:', error);
        alert('Failed to approve agent. Please try again.');
      },
    });
  }

  suspend(id: string): void {
    this.agentService.suspendAgent(id).subscribe({
      next: () => {
        this.updateStatus(id, 'SUSPENDED');
      },
      error: (error) => {
        console.error('Error suspending agent:', error);
        alert('Failed to suspend agent. Please try again.');
      },
    });
  }

  private updateStatus(id: string, status: string): void {
    this.agents = this.agents.map((a) => (a.id === id ? { ...a, status } : a));
  }
}
