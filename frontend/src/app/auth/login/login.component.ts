import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormErrorComponent, CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        const userRole = res.user?.role || this.authService.getUserRole();

        this.loading = false;

        switch (userRole) {
          case 'USER':
            this.router.navigate(['/user']);
            break;
          case 'AGENT':
            this.router.navigate(['/agent/dashboard']);
            break;
          case 'ADMIN':
          case 'MAIN_ADMIN': // MAIN_ADMIN is also an ADMIN role for dashboard
            this.router.navigate(['/admin']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        alert(
          'Login failed: ' +
            (err.error?.message || err.message || 'An unknown error occurred.'),
        ); // Improved error message
        this.loading = false;
      },
    });
  }
  goToRegister(): void {
    this.router.navigate(['auth/register']);
  }

  goToResetPassword(): void {
    this.router.navigate(['auth/reset-password']);
  }
}
