import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TokenService } from '../../core/services/token.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  @Input() set appHasRole(allowedRoles: string[]) {
    const user = this.tokenService.getUser() as unknown as { role?: string } | null;
    let hasAccess = false;
    if (user && user.role) {
      hasAccess = allowedRoles.includes(user.role);
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenService: TokenService
  ) {}
}
