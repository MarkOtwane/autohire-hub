import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AgentEditComponent implements OnInit {
  agentId!: string;
  form: FormGroup;
  loading = false;
  initialLoading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private agentService: AgentService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAgent();
  }

  loadAgent(): void {
    this.agentService.getAgentById(this.agentId).subscribe({
      next: (agent) => {
        this.form.patchValue(agent);
        this.initialLoading = false;
      },
      error: (error) => {
        console.error('Error loading agent:', error);
        this.initialLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.agentService.updateAgent(this.agentId, this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/agents']);
        },
        error: (error) => {
          console.error('Error updating agent:', error);
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/agents']);
  }
}
