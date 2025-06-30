import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormErrorComponent } from "../../shared/components/form-error.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [FormErrorComponent, CommonModule, ReactiveFormsModule],
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = false;
  token: string = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid || !this.token) return;

    this.loading = true;
    const newPassword = this.form.value.newPassword;

    this.authService
      .resetPassword({ token: this.token, newPassword })
      .subscribe({
        next: () => {
          this.successMessage =
            'Password successfully reset. You can now log in.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2500);
        },
        error: (err: any) => {
          console.error('Reset failed:', err);
          this.loading = false;
        },
      });
  }
}
