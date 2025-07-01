/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailerService: MailerService) {}

  private async sendEmail(options: {
    to: string;
    subject: string;
    template?: string;
    html?: string;
    context?: Record<string, any>;
  }): Promise<boolean> {
    const { to, subject, template, html, context } = options;

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        ...(template && { template }),
        ...(html && { html }),
        ...(context && { context }),
      });

      this.logger.log(`Email sent to ${to} with subject: "${subject}"`);
      return true;
    } catch (error) {
      this.logger.error({
        message: `Failed to send email to ${to}`,
        error: error.message,
        stack: error.stack,
        details: {
          subject,
          template,
          errorCode: error.code,
          smtpResponse: error.response,
        },
      });
      return false;
    }
  }

  async sendAdminCreatedEmail(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Admin Account Created',
      template: 'admin-created',
    });
  }

  async sendAgentCreatedEmail(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Agent Account Created',
      template: 'admin-created', // Consider creating a separate template
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        url: resetUrl,
        expirationMinutes: 15,
      },
    });
  }

  async testEmail(email: string): Promise<boolean> {
    return this.sendEmail({
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
  ): Promise<boolean> {
    const subject = `Your booking was ${status.toLowerCase()}`;
    const template =
      status === 'CONFIRMED' ? 'booking-confirmed' : 'booking-rejected';

    return this.sendEmail({
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
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Agent Assigned to Your Booking',
      template: 'agent-assigned',
      context: { agentName, bookingId },
    });
  }
}
