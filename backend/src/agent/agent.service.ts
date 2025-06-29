/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BookingStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAgentDto } from './dto/login-agent.dto';
import { ReportIssueDto } from './dto/report-issue.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class AgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAgentDto) {
    const agent = await this.prisma.agent.findUnique({
      where: { email: dto.email },
    });

    if (!agent) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!agent.isActive) {
      throw new ForbiddenException('Agent account is inactive');
    }

    const isMatch = await bcrypt.compare(dto.password, agent.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login time
    // await this.prisma.agent.update({
    //   where: { id: agent.id },
    //   data: { lastLoginAt: new Date() },
    // });

    const payload = {
      sub: agent.id,
      email: agent.email,
      role: Role.AGENT,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      agent: {
        id: agent.id,
        email: agent.email,
        isActive: agent.isActive,
      },
    };
  }

  async getMyBookings(agentId: string) {
    return this.prisma.booking.findMany({
      where: {
        agentId,
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            category: true,
            imageUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { pickupDate: 'desc' },
    });
  }

  async updateBookingStatus(
    bookingId: string,
    dto: UpdateStatusDto,
    agentId: string,
  ) {
    // Validate status input
    if (!(Object.values(BookingStatus) as string[]).includes(dto.status)) {
      throw new BadRequestException('Invalid booking status');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.agentId !== agentId) {
      throw new ForbiddenException('Not authorized to update this booking');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: { set: dto.status as BookingStatus } },
    });

    // Create notification for status change
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        message: `Your booking status changed to ${dto.status}`,
        type: 'BOOKING_STATUS_UPDATE',
      },
    });

    // Update agent metrics if booking is completed
    if (dto.status === BookingStatus.COMPLETED.toString()) {
      await this.prisma.agentMetric.upsert({
        where: { agentId },
        update: {
          bookingsHandled: { increment: 1 },
          vehiclesReturned: { increment: 1 },
        },
        create: {
          agentId,
          bookingsHandled: 1,
          vehiclesReturned: 1,
          issuesReported: 0,
        },
      });
    }

    return updatedBooking;
  }

  async reportIssue(agentId: string, dto: ReportIssueDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { vehicle: true },
    });

    if (!booking || booking.agentId !== agentId) {
      throw new ForbiddenException('Invalid booking for this agent');
    }

    const issue = await this.prisma.vehicleIssue.create({
      data: {
        agentId,
        bookingId: dto.bookingId,
        vehicleId: booking.vehicleId,
        description: dto.description,
        status: 'REPORTED',
        reportedAt: new Date(),
      },
    });

    // Update agent metrics
    await this.prisma.agentMetric.upsert({
      where: { agentId },
      update: { issuesReported: { increment: 1 } },
      create: {
        agentId,
        issuesReported: 1,
        bookingsHandled: 0,
        vehiclesReturned: 0,
      },
    });

    // Create admin notification
    await this.prisma.notification.create({
      data: {
        message: `New issue reported for vehicle ${booking.vehicle.name}`,
        type: 'VEHICLE_ISSUE',
      },
    });

    return issue;
  }

  async getStats(agentId: string) {
    const [totalBookings, completedBookings, activeBookings, metrics] =
      await Promise.all([
        this.prisma.booking.count({ where: { agentId } }),
        this.prisma.booking.count({
          where: {
            agentId,
            status: BookingStatus.COMPLETED,
          },
        }),
        this.prisma.booking.count({
          where: {
            agentId,
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
            },
          },
        }),
        this.prisma.agentMetric.findUnique({
          where: { agentId },
        }),
      ]);

    return {
      totalBookings,
      completedBookings,
      activeBookings,
      issuesReported: metrics?.issuesReported || 0,
      vehiclesReturned: metrics?.vehiclesReturned || 0,
      successRate:
        totalBookings > 0
          ? Math.round((completedBookings / totalBookings) * 100)
          : 0,
    };
  }
}
