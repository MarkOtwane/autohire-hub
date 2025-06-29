/* eslint-disable @typescript-eslint/no-unsafe-return */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAdminCreatedEmail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Admin Account Created',
      template: 'admin-created',
      context: { name },
    });
  }

  async sendAgentCreatedEmail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Admin Account Created',
      template: 'admin-created',
      context: { name },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        url: resetUrl,
        expirationMinutes: 15,
      },
    });
  }

  async testEmail(email: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: '🚀 Test Email from CarRental App',
      html: `<h1>Welcome!</h1><p>This is a test email from your backend.</p>`,
    });
  }

  async sendBookingStatusEmail(
    email: string,
    status: 'CONFIRMED' | 'REJECTED',
    name: string,
    vehicle: string,
  ): Promise<void> {
    const subject = `Your booking was ${status.toLowerCase()}`;
    const template =
      status === 'CONFIRMED' ? 'booking-confirmed' : 'booking-rejected';

    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: { name, vehicle },
    });
  }

  async sendAgentAssignedEmail(
    email: string,
    agentName: string,
    bookingId: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Agent Assigned to Your Booking',
      template: 'agent-assigned',
      context: { agentName, bookingId },
    });
  }
}
