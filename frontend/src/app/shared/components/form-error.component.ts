import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  template: `
    <small class="error" *ngIf="control && control.errors && control.touched">
      <span *ngIf="control.errors['required']">This field is required</span>
      <span *ngIf="control.errors['email']">Enter a valid email</span>
      <span *ngIf="control.errors['minlength']">Too short</span>
    </small>
  `,
  styles: [
    `
      .error {
        color: #e53935;
        font-size: 12px;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;
}
