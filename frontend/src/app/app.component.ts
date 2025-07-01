import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, CommonModule],

  template: ` <app-home></app-home> `,
})
export class AppComponent {
  title = 'frontend';
}
