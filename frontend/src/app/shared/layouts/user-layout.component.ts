import { Component } from "@angular/core";
import { RouteModule } from "next/dist/server/route-modules/route-module";

@Component({
  selector: 'app-user-layout',
  template: `
    <app-user-navbar></app-user-navbar>
    <router-outlet></router-outlet>
  `,
  
})
export class UserLayoutComponent {}
