import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckBookingConflictDto } from './dto/check-booking-conflict.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const { pickupDate, dropoffDate } = this.parseAndValidateDateRange(
      dto.pickupDate,
      dto.dropoffDate,
    );

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
      select: {
        id: true,
        availability: true,
        pricePerDay: true,
        pricePerHour: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (!vehicle.availability) {
      throw new ConflictException('Vehicle is currently unavailable');
    }

    const overlappingBooking = await this.findOverlappingBooking(
      dto.vehicleId,
      pickupDate,
      dropoffDate,
    );

    if (overlappingBooking) {
      throw new ConflictException(
        'Vehicle already booked for the selected dates',
      );
    }

    const totalAmount = this.calculateTotalAmount(
      pickupDate,
      dropoffDate,
      vehicle.pricePerDay,
      vehicle.pricePerHour,
    );

    return this.prisma.booking.create({
      data: {
        userId,
        vehicleId: dto.vehicleId,
        pickupDate,
        dropoffDate,
        totalAmount,
        options: dto.options,
      },
    });
  }

  async validateConflict(dto: CheckBookingConflictDto) {
    const { pickupDate, dropoffDate } = this.parseAndValidateDateRange(
      dto.pickupDate,
      dto.dropoffDate,
    );

    const overlappingBooking = await this.findOverlappingBooking(
      dto.vehicleId,
      pickupDate,
      dropoffDate,
      dto.excludeBookingId,
    );

    return {
      hasConflict: Boolean(overlappingBooking),
      conflictingBookingId: overlappingBooking?.id ?? null,
    };
  }

  private parseAndValidateDateRange(pickupRaw: string, dropoffRaw: string) {
    const pickupDate = new Date(pickupRaw);
    const dropoffDate = new Date(dropoffRaw);

    if (
      Number.isNaN(pickupDate.getTime()) ||
      Number.isNaN(dropoffDate.getTime())
    ) {
      throw new BadRequestException('Invalid booking dates');
    }

    if (dropoffDate <= pickupDate) {
      throw new BadRequestException('Dropoff date must be after pickup date');
    }

    return { pickupDate, dropoffDate };
  }

  private findOverlappingBooking(
    vehicleId: string,
    pickupDate: Date,
    dropoffDate: Date,
    excludeBookingId?: string,
  ) {
    return this.prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        pickupDate: { lt: dropoffDate },
        dropoffDate: { gt: pickupDate },
        ...(excludeBookingId
          ? {
              NOT: {
                id: excludeBookingId,
              },
            }
          : {}),
      },
      select: { id: true },
    });
  }

  private calculateTotalAmount(
    pickupDate: Date,
    dropoffDate: Date,
    pricePerDay: number,
    pricePerHour: number,
  ): number {
    const durationMs = dropoffDate.getTime() - pickupDate.getTime();
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    const days = Math.floor(durationHours / 24);
    const remainingHours = durationHours % 24;
    return days * pricePerDay + remainingHours * pricePerHour;
  }

  async findMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true,
        payment: true,
        agent: true,
      },
    });
  }

  async findByIdForActor(
    actor: { id: string; role: string },
    bookingId: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, agent: true, payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (actor.role === 'USER' && booking.userId !== actor.id) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    if (actor.role === 'AGENT' && booking.agentId !== actor.id) {
      throw new ForbiddenException('You can only view assigned bookings');
    }

    return booking;
  }

  async cancel(actor: { id: string; role: string }, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (actor.role === 'USER' && booking.userId !== actor.id) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    if (actor.role === 'AGENT' && booking.agentId !== actor.id) {
      throw new ForbiddenException(
        'You can only cancel bookings assigned to you',
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }

  async updateStatus(bookingId: string, dto: UpdateStatusDto) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
    });
  }

  async findPendingForApproval() {
    return this.prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: { user: true, vehicle: true },
    });
  }

  async assignAgent(bookingId: string, agentId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { agentId },
    });
  }
}
