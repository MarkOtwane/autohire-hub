import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TokenService } from '../../core/services/token.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  @Input() set appHasRole(allowedRoles: string[]) {
    const user = this.tokenService.getUser();
    const hasAccess = user && allowedRoles.includes(user.role);

    hasAccess
      ? this.viewContainer.createEmbeddedView(this.templateRef)
      : this.viewContainer.clear();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenService: TokenService
  ) {}
}
