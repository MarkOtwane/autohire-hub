import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog" *ngIf="visible">
      <p>{{ message }}</p>
      <button (click)="confirm.emit()">Yes</button>
      <button (click)="cancel.emit()">No</button>
    </div>
  `,
  styles: [
    `
      .dialog {
        padding: 1rem;
        background: white;
        border: 1px solid #ccc;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() message: string = 'Are you sure?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
