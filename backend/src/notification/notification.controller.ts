/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { NotificationsService } from './notification.service';
import * as nodemailer from 'nodemailer';

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
  async testSmtp() {
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'otwanemark254@gmail.com',
        pass: 'nzuqbfukufquhoxi',
      },
    });

    try {
      await testTransporter.sendMail({
        to: 'otwanemark003@gmail.com',
        subject: 'Direct SMTP Test',
        text: 'This is a direct test',
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
