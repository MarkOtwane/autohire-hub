import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, CommonModule],
  template: ` <h1>Hello from Car Rental App!</h1> `,
})
export class AppComponent {
  title = 'frontend';
}
