/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.tdo';
import { UpdatePasswordDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService, // Added missing dependency
  ) {}

  async createAdmin(dto: CreateAdminDto, creatorId: string) {
    // Check if email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (existingAdmin) {
      throw new ForbiddenException('Email already in use');
    }

    const creator = await this.prisma.admin.findUnique({
      where: { id: creatorId },
    });
    if (!creator?.isMain) {
      throw new ForbiddenException(
        'Only the main admin can create other admins.',
      );
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const admin = await this.prisma.admin.create({
      data: {
        ...dto,
        password: hashed,
        isMain: false, // Ensure new admins are not main admins
      },
    });

    await this.notificationsService.sendAdminCreatedEmail(dto.email);

    return admin;
  }

  async updatePassword(adminId: string, dto: UpdatePasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const match = await bcrypt.compare(dto.oldPassword, admin.password);
    if (!match) {
      throw new ForbiddenException('Old password is incorrect.');
    }

    // Check if new password is different from old password
    if (await bcrypt.compare(dto.newPassword, admin.password)) {
      throw new ForbiddenException(
        'New password must be different from old password',
      );
    }

    const newHashed = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.admin.update({
      where: { id: adminId },
      data: { password: newHashed },
    });
  }

  async getAllAdmins(requesterId: string) {
    const requester = await this.prisma.admin.findUnique({
      where: { id: requesterId },
    });

    if (!requester?.isMain) {
      throw new ForbiddenException('Only the main admin can view all admins.');
    }

    return this.prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        isMain: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      isMain: admin.isMain,
      role: 'admin',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        isMain: admin.isMain,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        isMain: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async deleteAdmin(id: string, requesterId: string) {
    // Prevent deleting yourself
    if (id === requesterId) {
      throw new ForbiddenException('You cannot delete yourself');
    }

    const requester = await this.prisma.admin.findUnique({
      where: { id: requesterId },
    });

    if (!requester?.isMain) {
      throw new ForbiddenException('Only the main admin can delete admins.');
    }

    const adminToDelete = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!adminToDelete) {
      throw new NotFoundException('Admin not found');
    }

    // Prevent deleting the main admin
    if (adminToDelete.isMain) {
      throw new ForbiddenException('Cannot delete the main admin');
    }

    return this.prisma.admin.delete({ where: { id } });
  }
}
