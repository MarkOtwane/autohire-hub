import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormErrorComponent, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });

    this.userService
      .getProfile()
      .subscribe((data) => this.form.patchValue(data));
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    this.userService.updateProfile(this.form.value).subscribe(() => {
      this.loading = false;
    });
  }
}
