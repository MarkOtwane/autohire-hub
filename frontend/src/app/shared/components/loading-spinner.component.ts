import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `<div class="spinner" *ngIf="isLoading">
    <span class="material-icons">autorenew</span> Loading...
  </div>`,
  styles: [
    `
      .spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        font-weight: bold;
        color: #1976d2;
      }
    `,
  ],
  imports: [CommonModule],
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;
}
