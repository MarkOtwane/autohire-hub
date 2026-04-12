import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentCreateComponent } from './agent-create/agent-create.component';
import { AgentEditComponent } from './agent-edit/agent-edit.component';
import { AgentsListComponent } from './agent-list/agent-list.component';
import { AgentsRoutingModule } from './agent-routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgentsRoutingModule,
    AgentsListComponent,
    AgentCreateComponent,
    AgentEditComponent,
  ],
})
export class AgentsModule {}
