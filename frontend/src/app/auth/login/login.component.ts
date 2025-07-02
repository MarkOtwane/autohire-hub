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
    private router: Router
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
        // --- FIX IS HERE ---
        // Change res.user.role to res.admin.role
        console.log('response', res.admin.role); // Corrected: res.admin.role

        // Also ensure you use the correct variable for the switch
        const userRole = res.admin.role; // Extract the role here

        this.loading = false; // Set loading to false on success, not true again

        switch (
          userRole // Use userRole here
        ) {
          case 'USER':
            this.router.navigate(['/user/dashboard']);
            break;
          case 'AGENT':
            this.router.navigate(['/agent/dashboard']);
            break;
          case 'ADMIN':
          case 'MAIN_ADMIN': // MAIN_ADMIN is also an ADMIN role for dashboard
            this.router.navigate(['/admin/dashboard']);
            break;
          default:
            this.router.navigate(['/home']); // Or a default landing page
            break;
        }
      },
      error: (err) => {
        alert(
          'Login failed: ' +
            (err.error?.message || err.message || 'An unknown error occurred.')
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
