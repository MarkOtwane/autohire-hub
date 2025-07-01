import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AgentDashboardComponent } from "../../agent/dashboard/agent-dashboard.component";

@Component({
  selector: 'app-agent-layout',
  template: `
    <app-agent-dashboard></app-agent-dashboard>
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule, AgentDashboardComponent],
})
export class AgentLayoutComponent {}
  