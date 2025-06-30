import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { FormErrorComponent } from './components/form-error.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';
import { ToastComponent } from './components/toast.component';

// Layouts
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { AgentLayoutComponent } from './layouts/agent-layout.component';
import { UserLayoutComponent } from './layouts/user-layout.component';

// Pipes
import { HasRoleDirective } from './directives/has-role.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AutofocusDirective } from './directives/autofocus.directive';

// Directives
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ToastComponent,
    FormErrorComponent,
    ConfirmDialogComponent,
    AdminLayoutComponent,
    AgentLayoutComponent,
    UserLayoutComponent,
    TruncatePipe,
    FormatDatePipe,
    CapitalizePipe,
    HasRoleDirective,
    AutofocusDirective,
  ],
  exports: [
    LoadingSpinnerComponent,
    ToastComponent,
    FormErrorComponent,
    ConfirmDialogComponent,
    AdminLayoutComponent,
    AgentLayoutComponent,
    UserLayoutComponent,
    TruncatePipe,
    FormatDatePipe,
    CapitalizePipe,
    HasRoleDirective,
    AutofocusDirective,
  ],
})
export class SharedModule {}
