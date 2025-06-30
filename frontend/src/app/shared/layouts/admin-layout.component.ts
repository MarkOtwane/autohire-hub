import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <app-admin-navbar></app-admin-navbar>
    <div class="admin-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {}
