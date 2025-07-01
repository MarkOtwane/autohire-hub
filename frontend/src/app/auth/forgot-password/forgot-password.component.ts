import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    const email = this.form.value.email;

    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.successMessage = 'Check your inbox for a password reset link.';
        this.loading = false;
        this.form.reset();
      },
      error: (err: any) => {
        console.error('Forgot password error:', err);
        this.loading = false;
      },
    });
  }
}
