import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs/umd/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NotificationsService } from 'src/notification/notification.service';

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
        email: user.email,
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

    // Try admin first, then agent
    await this.prisma.admin.updateMany({
      where: { email: record.email },
      data: { password: hashed },
    });

    await this.prisma.agent.updateMany({
      where: { email: record.email },
      data: { password: hashed },
    });

    await this.prisma.passwordResetToken.delete({
      where: { token: dto.token },
    });
  }

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
        email: user.email,
        token,
        expiresAt,
      },
    });

    // ✅ Put it here
    await this.notifications.sendPasswordResetEmail(user.email, token);
  }
}
