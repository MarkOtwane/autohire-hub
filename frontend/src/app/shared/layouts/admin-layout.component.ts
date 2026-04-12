import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout-flex">
      <aside class="admin-sidebar">
        <div class="sidebar-header">Admin Panel</div>
        <nav>
          <ul>
            <li><a routerLink="/admin" routerLinkActive="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a routerLink="/admin/vehicles" routerLinkActive="active"><i class="fas fa-car"></i> Vehicles</a></li>
            <li><a routerLink="/admin/agents" routerLinkActive="active"><i class="fas fa-user-shield"></i> Agents</a></li>
            <li><a routerLink="/admin/bookings" routerLinkActive="active"><i class="fas fa-book"></i> Bookings</a></li>
            <li><a routerLink="/admin/notifications" routerLinkActive="active"><i class="fas fa-bell"></i> Notifications</a></li>
          </ul>
        </nav>
      </aside>
      <main class="admin-main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule],
  standalone: true,
})
export class AdminLayoutComponent {}
