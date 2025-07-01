import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '../../user/profile/profile.component';

@Component({
  selector: 'app-user-layout',
  template: `
    <app-profile></app-profile>
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule, ProfileComponent],
})
export class UserLayoutComponent {}
