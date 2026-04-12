import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agent-create',
  templateUrl: './agent-create.component.html',
  styleUrls: ['./agent-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AgentCreateComponent {
  form;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: ['PENDING', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.agentService.createAgent(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/agents']);
        },
        error: (error) => {
          console.error('Error creating agent:', error);
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/agents']);
  }
}
