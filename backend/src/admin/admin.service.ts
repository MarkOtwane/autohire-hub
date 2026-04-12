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
import { BookingStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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
        role: Role.ADMIN,
        isMainAdmin: false,
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

    return { message: 'Password updated successfully' };
  }

  async getAllAdmins(requesterId: string) {
    const requester = await this.prisma.admin.findUnique({
      where: { id: requesterId },
    });

    if (!requester?.isMainAdmin) {
      throw new ForbiddenException('Only the main admin can view all admins');
    }

    return this.prisma.admin.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        role: true,
        isMainAdmin: true,
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
      isMainAdmin: admin.isMainAdmin,
    };

    const token = await this.jwtService.signAsync(payload);

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
        isMainAdmin: admin.isMainAdmin,
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
      throw new ForbiddenException('Only the main admin can delete admins');
    }

    if (!adminToDelete) throw new NotFoundException('Admin not found');
    if (adminToDelete.isMainAdmin) {
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

  async deleteAgent(agentId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.MAIN_ADMIN,
      action: 'DELETE_AGENT',
      target: agentId,
      metadata: { email: agent.email },
    });

    return this.prisma.agent.delete({ where: { id: agentId } });
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
      actorId: '',
      actorRole: Role.ADMIN,
      action: status ? 'ACTIVATE_AGENT' : 'DEACTIVATE_AGENT',
      target: agentId,
      metadata: { email: agent.email },
    });

    return updatedAgent;
  }

  // Vehicle Management
  async getVehicles() {
    return this.prisma.vehicle.findMany({
      include: {
        bookings: {
          where: { status: 'CONFIRMED' },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVehicle(dto: any) {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        pricePerDay: dto.pricePerDay,
        pricePerHour: dto.pricePerHour,
        availability: dto.availability ?? true,
        location: dto.location,
        transmission: dto.transmission,
        fuelType: dto.fuelType,
        features: dto.features || [],
        imageUrl: dto.imageUrl,
      },
    });

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.ADMIN,
      action: 'CREATE_VEHICLE',
      target: vehicle.id,
      metadata: { name: vehicle.name },
    });

    return vehicle;
  }

  async updateVehicle(id: string, dto: any) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        pricePerDay: dto.pricePerDay,
        pricePerHour: dto.pricePerHour,
        availability: dto.availability,
        location: dto.location,
        transmission: dto.transmission,
        fuelType: dto.fuelType,
        features: dto.features,
        imageUrl: dto.imageUrl,
      },
    });

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.ADMIN,
      action: 'UPDATE_VEHICLE',
      target: id,
      metadata: { name: updatedVehicle.name },
    });

    return updatedVehicle;
  }

  async deleteVehicle(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.bookings.length > 0) {
      throw new BadRequestException(
        'Cannot delete vehicle with existing bookings',
      );
    }

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.ADMIN,
      action: 'DELETE_VEHICLE',
      target: id,
      metadata: { name: vehicle.name },
    });

    return this.prisma.vehicle.delete({ where: { id } });
  }

  // Booking Management
  async getBookings() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        vehicle: { select: { id: true, name: true, category: true } },
        agent: { select: { id: true, email: true } },
        payment: { select: { id: true, status: true, amount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as BookingStatus },
    });

    // Send notification to user
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        message: `Your booking has been ${status.toLowerCase()}`,
        type: 'BOOKING_STATUS_UPDATE',
      },
    });

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.ADMIN,
      action: 'UPDATE_BOOKING_STATUS',
      target: bookingId,
      metadata: { status, userEmail: booking.user.email },
    });

    return updatedBooking;
  }

  // Notification Management
  async sendNotification(dto: {
    userId?: string;
    message: string;
    type: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        message: dto.message,
        type: dto.type,
      },
    });

    await this.auditService.logAction({
      actorId: '',
      actorRole: Role.ADMIN,
      action: 'SEND_NOTIFICATION',
      target: notification.id,
      metadata: { message: dto.message, type: dto.type },
    });

    return notification;
  }

  async getNotifications() {
    return this.prisma.notification.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        admin: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalBookings,
      totalRevenue,
      fleetStats,
      recentBookings,
      pendingBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      this.prisma.vehicle.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
      this.prisma.booking.findMany({
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          vehicle: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
    ]);

    const fleetByCategory = fleetStats.reduce(
      (acc, stat) => {
        acc[stat.category] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      fleet: {
        total: await this.prisma.vehicle.count(),
        byCategory: fleetByCategory,
      },
      recentBookings,
      pendingBookings,
    };
  }

  async getDashboardSummary() {
    const [
      totalAdmins,
      totalAgents,
      activeAgents,
      totalUsers,
      totalVehicles,
      pendingBookings,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.admin.count({ where: { role: Role.ADMIN } }),
      this.prisma.agent.count(),
      this.prisma.agent.count({ where: { isActive: true } }),
      this.prisma.user.count(),
      this.prisma.vehicle.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.notification.count({ where: { isRead: false } }),
    ]);

    return {
      adminCount: totalAdmins,
      agentCount: totalAgents,
      activeAgentCount: activeAgents,
      userCount: totalUsers,
      vehicleCount: totalVehicles,
      pendingBookingsCount: pendingBookings,
      unreadNotificationsCount: unreadNotifications,
    };
  }
}
