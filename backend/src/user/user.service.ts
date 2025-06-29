import { ForbiddenException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ReviewDto } from './dto/review.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        profilePhoto: true,
        createdAt: true,
      },
    });
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('User not found'); // Add this line
    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new ForbiddenException('Old password incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }

  async getRentalHistory(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true },
    });
  }

  async leaveReview(userId: string, dto: ReviewDto) {
    return this.prisma.review.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async getMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { vehicle: true },
    });
  }
}
