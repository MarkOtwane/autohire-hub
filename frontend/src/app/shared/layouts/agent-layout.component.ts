import { Component } from "@angular/core";

@Component({
  selector: 'app-agent-layout',
  template: `
    <app-agent-navbar></app-agent-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AgentLayoutComponent {}
  