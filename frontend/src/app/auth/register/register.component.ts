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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormErrorComponent, ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required],
    });
  }
  onBookNowClick() {
    this.router.navigate(['/auth/login']);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    this.authService.register(formData).subscribe({
      next: () => {
        this.loading = false;
        alert('Registration successful! Please log in with your new account.');
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        this.loading = false;
        alert(
          'Registration failed: ' +
            (err.error?.message || 'An unknown error occurred.')
        );
      },
    });
  }
}
