import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { NotificationsService } from './notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test')
  @Roles('ADMIN', 'MAIN_ADMIN')
  sendTestEmail(@Body('email') email: string) {
    return this.notificationsService.testEmail(email);
  }
}
