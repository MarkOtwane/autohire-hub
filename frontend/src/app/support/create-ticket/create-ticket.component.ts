import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupportService } from '../../core/services/support.service';
import { FormErrorComponent } from "../../shared/components/form-error.component";

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  imports: [FormErrorComponent, ReactiveFormsModule],
})
export class CreateTicketComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.supportService.createTicket(this.form.value).subscribe({
      next: () => this.router.navigate(['/support/my-tickets']),
      error: () => (this.loading = false),
    });
  }
}
