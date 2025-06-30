import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
