import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `<div class="toast" [ngClass]="type">{{ message }}</div>`,
  styles: [
    `
      .toast {
        padding: 12px;
        margin: 10px 0;
        border-radius: 4px;
        font-weight: bold;
      }
      .success {
        background: #d4edda;
        color: #155724;
      }
      .error {
        background: #f8d7da;
        color: #721c24;
      }
    `,
  ],
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
}
