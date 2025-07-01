import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
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
    console.log('🟡 changePassword called for:', userId); // Debug log

    if (!userId) throw new BadRequestException('Missing user ID');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    console.log('🟣 user fetched:', user);

    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new ForbiddenException('Old password is incorrect');

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

  /**
   * Creates a new user in the database.
   * This method is typically used by an Admin or for direct user creation (e.g., by another service).
   * For self-registration, the AuthService's register method is usually used.
   * @param dto The data transfer object containing user details.
   * @returns The created User object.
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    // Check if a user with the given email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        role: dto.role,
        isEmailVerified: dto.isEmailVerified || true,
        profilePhoto: dto.profilePhoto,
      },
    });
  }

  /**
   * Updates an existing user's details.
   * This method can be used by an Admin to update any user's profile.
   * For a user updating their own profile, `updateMe` is typically used.
   * @param userId The ID of the user to update.
   * @param dto The data transfer object containing fields to update.
   * @returns The updated User object.
   */
  async updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    // if (dto.password) {
    //   dto.password = await bcrypt.hash(dto.password, 10);
    // }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }
}
