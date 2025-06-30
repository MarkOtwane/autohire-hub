import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentsRoutingModule } from './agents-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgentsListComponent } from './agents-list/agents-list.component';

@NgModule({
  declarations: [AgentsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AgentsRoutingModule,
  ],
})
export class AgentsModule {}
