/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  @Post('test-smtp')
  @Roles('ADMIN', 'MAIN_ADMIN')
  async testSmtp(@Body('email') email?: string) {
    const targetEmail = email || process.env.EMAIL_USER;
    if (!targetEmail) {
      return { success: false, error: 'No email provided for SMTP test' };
    }

    const sent = await this.notificationsService.testEmail(targetEmail);
    return { success: sent };
  }
}
