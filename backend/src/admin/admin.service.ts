/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuditService } from 'src/audit/audit.service';
import { NotificationsService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { LoginAdminDto } from './dto/login-admin.tdo';
import { UpdatePasswordDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  async createAdmin(dto: CreateAdminDto, creatorId: string) {
    const [existingAdmin, creator] = await Promise.all([
      this.prisma.admin.findUnique({ where: { email: dto.email } }),
      this.prisma.admin.findUnique({ where: { id: creatorId } }),
    ]);

    if (existingAdmin) {
      throw new ForbiddenException('Email already in use');
    }

    if (!creator?.isMainAdmin) {
      throw new ForbiddenException(
        'Only the main admin can create other admins',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: Role.ADMIN, // Added role from enum
        isMainAdmin: false, // Changed from isMain to isMainAdmin
      },
    });

    await this.notificationsService.sendAdminCreatedEmail(dto.email);
    await this.auditService.logAction({
      actorId: creatorId,
      actorRole: Role.MAIN_ADMIN,
      action: 'CREATE_ADMIN',
      target: admin.id,
      metadata: { email: admin.email },
    });

    return admin;
  }

  async updatePassword(adminId: string, dto: UpdatePasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, admin.password);
    if (!isMatch) throw new ForbiddenException('Old password is incorrect');

    const isSamePassword = await bcrypt.compare(
      dto.newPassword,
      admin.password,
    );
    if (isSamePassword) {
      throw new ForbiddenException('New password must be different');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: newHashedPassword },
    });

    await this.auditService.logAction({
      actorId: adminId,
      actorRole: admin.role,
      action: 'UPDATE_PASSWORD',
      target: adminId,
      metadata: {},
    });

    return { message: 'Password updated successfully' }; //changing password
  }

  async getAllAdmins(requesterId: string) {
    const requester = await this.prisma.admin.findUnique({
      where: { id: requesterId },
    });

    if (!requester?.isMainAdmin) {
      // Changed from isMain to isMainAdmin
      throw new ForbiddenException('Only the main admin can view all admins');
    }

    return this.prisma.admin.findMany({
      where: { role: Role.ADMIN }, // Only return ADMIN role users
      select: {
        id: true,
        email: true,
        role: true,
        isMainAdmin: true, // Changed from isMain to isMainAdmin
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      isMainAdmin: admin.isMainAdmin, // Changed from isMain to isMainAdmin
    };

    const token = await this.jwtService.signAsync(payload);

    // Create notification for admin login
    await this.prisma.notification.create({
      data: {
        adminId: admin.id,
        message: 'Successful login',
        type: 'ADMIN_LOGIN',
      },
    });

    return {
      access_token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        isMainAdmin: admin.isMainAdmin, // Changed from isMain to isMainAdmin
      },
    };
  }

  async getProfile(adminId: string) {
    if (!adminId) throw new BadRequestException('Admin ID is required');

    return this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        role: true,
        isMainAdmin: true,
        createdAt: true,
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async deleteAdmin(id: string, requesterId: string) {
    if (id === requesterId) {
      throw new ForbiddenException('You cannot delete yourself');
    }

    const [requester, adminToDelete] = await Promise.all([
      this.prisma.admin.findUnique({ where: { id: requesterId } }),
      this.prisma.admin.findUnique({ where: { id } }),
    ]);

    if (!requester?.isMainAdmin) {
      // Changed from isMain to isMainAdmin
      throw new ForbiddenException('Only the main admin can delete admins');
    }

    if (!adminToDelete) throw new NotFoundException('Admin not found');
    if (adminToDelete.isMainAdmin) {
      // Changed from isMain to isMainAdmin
      throw new ForbiddenException('Cannot delete the main admin');
    }

    await this.auditService.logAction({
      actorId: requesterId,
      actorRole: Role.MAIN_ADMIN,
      action: 'DELETE_ADMIN',
      target: id,
      metadata: { email: adminToDelete.email },
    });

    return this.prisma.admin.delete({ where: { id } });
  }

  // async createAgent(dto: CreateAgentDto) {
  //   const exists = await this.prisma.agent.findUnique({
  //     where: { email: dto.email },
  //   });
  //   if (exists) throw new ConflictException('Agent already exists');

  //   const hashed = await bcrypt.hash(dto.password, 10);

  //   return this.prisma.agent.create({
  //     data: {
  //       email: dto.email,
  //       password: hashed,
  //     },
  //   });
  // }

  async createAgent(dto: CreateAgentDto, adminId: string) {
    const existingAgent = await this.prisma.agent.findUnique({
      where: { email: dto.email },
    });

    if (existingAgent) {
      throw new ForbiddenException('Email already in use by another agent');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const agent = await this.prisma.agent.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        isActive: true,
      },
    });

    await this.auditService.logAction({
      actorId: adminId,
      actorRole: Role.MAIN_ADMIN,
      action: 'CREATE_AGENT',
      target: agent.id,
      metadata: { email: agent.email },
    });

    await this.notificationsService.sendAgentCreatedEmail(agent.email);

    return agent;
  }

  async getAgents() {
    return this.prisma.agent.findMany({
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        metrics: {
          select: {
            bookingsHandled: true,
            vehiclesReturned: true,
            issuesReported: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleAgentStatus(agentId: string, status: boolean) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const updatedAgent = await this.prisma.agent.update({
      where: { id: agentId },
      data: { isActive: status },
    });

    await this.auditService.logAction({
      actorId: '', // System-initiated action
      actorRole: Role.ADMIN,
      action: status ? 'ACTIVATE_AGENT' : 'DEACTIVATE_AGENT',
      target: agentId,
      metadata: { email: agent.email },
    });

    return updatedAgent;
  }
}
