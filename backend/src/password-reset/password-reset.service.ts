/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { NotificationsService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// ...existing code...

@Injectable()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}
  async requestReset(dto: ForgotPasswordDto) {
    const user =
      (await this.prisma.admin.findUnique({ where: { email: dto.email } })) ||
      (await this.prisma.agent.findUnique({ where: { email: dto.email } }));

    if (!user) throw new NotFoundException('No user found');

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.notifications.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Token expired or invalid');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    if (record.adminId) {
      await this.prisma.admin.update({
        where: { id: record.adminId },
        data: { password: hashed },
      });
    } else if (record.agentId) {
      await this.prisma.agent.update({
        where: { id: record.agentId },
        data: { password: hashed },
      });
    }

    await this.prisma.passwordResetToken.delete({
      where: { token: dto.token },
    });
  }
}
