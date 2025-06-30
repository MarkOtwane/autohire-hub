import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  changePassword() {
    if (this.form.invalid) return;
    this.loading = true;
    this.userService.changePassword(this.form.value).subscribe(() => {
      this.loading = false;
      this.form.reset();
    });
  }
}
