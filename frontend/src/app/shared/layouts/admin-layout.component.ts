import { Component } from '@angular/core';
import { DashboardComponent } from "../../admin/dashboard/dashboard.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <app-dashboard></app-dashboard>
    <div class="admin-container">
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [DashboardComponent, RouterModule],
})
export class AdminLayoutComponent {}
