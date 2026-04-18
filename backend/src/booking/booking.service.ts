import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CheckBookingConflictDto } from './dto/check-booking-conflict.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RebookBookingDto } from './dto/rebook-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private normalizeBookingOptions(
    options: unknown,
  ): Prisma.InputJsonValue | undefined {
    if (options === null || options === undefined) {
      return undefined;
    }

    return options as Prisma.InputJsonValue;
  }

  private parseUtcDate(value: string): Date {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid booking dates');
    }

    return new Date(
      Date.UTC(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ),
    );
  }

  private getTodayUtcStart(): Date {
    const now = new Date();

    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  private toExclusiveEnd(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
    );
  }

  private normalizeRequestedRange(pickupRaw: string, dropoffRaw: string) {
    const pickupDate = this.parseUtcDate(pickupRaw);
    const selectedDropoffDate = this.parseUtcDate(dropoffRaw);

    if (pickupDate < this.getTodayUtcStart()) {
      throw new BadRequestException('Past date bookings are not allowed');
    }

    if (selectedDropoffDate < pickupDate) {
      throw new BadRequestException('Dropoff date must be after pickup date');
    }

    return {
      pickupDate,
      dropoffDate: this.toExclusiveEnd(selectedDropoffDate),
    };
  }

  private async lockVehicleRow(
    tx: Prisma.TransactionClient,
    vehicleId: string,
  ): Promise<void> {
    await tx.$queryRaw`SELECT id FROM vehicles WHERE id = ${vehicleId} FOR UPDATE`;
  }

  private async findOverlappingBooking(
    tx: Prisma.TransactionClient,
    vehicleId: string,
    pickupDate: Date,
    dropoffDate: Date,
    excludeBookingId?: string,
  ) {
    return tx.booking.findFirst({
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

  private async getAuthorizedBooking(
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

  async create(userId: string, dto: CreateBookingDto) {
    const { pickupDate, dropoffDate } = this.normalizeRequestedRange(
      dto.pickupDate,
      dto.dropoffDate,
    });

    return this.prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
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

      await this.lockVehicleRow(tx, dto.vehicleId);

      const overlappingBooking = await this.findOverlappingBooking(
        tx,
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

      return tx.booking.create({
        data: {
          userId,
          vehicleId: dto.vehicleId,
          pickupDate,
          dropoffDate,
          totalAmount,
          options: this.normalizeBookingOptions(dto.options),
        },
      });
    });
  }

  async validateConflict(dto: CheckBookingConflictDto) {
    const { pickupDate, dropoffDate } = this.normalizeRequestedRange(
      dto.pickupDate,
      dto.dropoffDate,
    );

    const overlappingBooking = await this.findOverlappingBooking(
      this.prisma,
      dto.vehicleId,
      pickupDate,
      dropoffDate,
      dto.excludeBookingId,
    );

    return {
      isAvailable: !overlappingBooking,
      hasConflict: Boolean(overlappingBooking),
      conflictingBookingId: overlappingBooking?.id ?? null,
    };
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
    return this.getAuthorizedBooking(actor, bookingId);
  }

  async getTimeline(actor: { id: string; role: string }, bookingId: string) {
    const booking = await this.getAuthorizedBooking(actor, bookingId);

    const timeline: Array<{
      code: string;
      title: string;
      description: string;
      timestamp: Date;
      isEstimated: boolean;
    }> = [
      {
        code: 'BOOKING_CREATED',
        title: 'Booking Created',
        description: 'Your booking request was submitted.',
        timestamp: booking.createdAt,
        isEstimated: false,
      },
      {
        code: 'PICKUP_SCHEDULED',
        title: 'Pickup Scheduled',
        description: 'Vehicle pickup is scheduled for this time.',
        timestamp: booking.pickupDate,
        isEstimated: false,
      },
      {
        code: 'RETURN_SCHEDULED',
        title: 'Return Scheduled',
        description: 'Vehicle return is scheduled for this time.',
        timestamp: booking.dropoffDate,
        isEstimated: false,
      },
    ];

    if (booking.payment) {
      timeline.push({
        code: 'PAYMENT_RECORDED',
        title: 'Payment Recorded',
        description: `Payment ${booking.payment.status.toLowerCase()} via ${booking.payment.provider}.`,
        timestamp: booking.payment.createdAt,
        isEstimated: false,
      });
    }

    const statusMap: Record<
      BookingStatus,
      { title: string; description: string }
    > = {
      PENDING: {
        title: 'Awaiting Approval',
        description: 'Your booking is awaiting review by the operations team.',
      },
      CONFIRMED: {
        title: 'Booking Confirmed',
        description: 'Your booking has been approved and confirmed.',
      },
      CANCELLED: {
        title: 'Booking Cancelled',
        description: 'This booking was cancelled.',
      },
      COMPLETED: {
        title: 'Trip Completed',
        description: 'The rental trip has been marked as completed.',
      },
      REJECTED: {
        title: 'Booking Rejected',
        description: 'This booking was rejected by operations.',
      },
    };

    timeline.push({
      code: `STATUS_${booking.status}`,
      title: statusMap[booking.status].title,
      description: statusMap[booking.status].description,
      timestamp: booking.payment?.createdAt ?? booking.createdAt,
      isEstimated: booking.payment ? false : true,
    });

    timeline.sort(
      (left, right) => left.timestamp.getTime() - right.timestamp.getTime(),
    );

    return {
      bookingId: booking.id,
      currentStatus: booking.status,
      timeline,
    };
  }

  async cancel(actor: { id: string; role: string }, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
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

      if (booking.status === BookingStatus.CANCELLED) {
        return booking;
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });
    });
  }

  async update(
    actor: { id?: string; sub?: string; role: string },
    bookingId: string,
    dto: UpdateBookingDto,
  ) {
    const actorId = actor.id ?? actor.sub;

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { vehicle: true },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      const isAdmin = actor.role === 'ADMIN' || actor.role === 'MAIN_ADMIN';
      const isAssignedAgent = actor.role === 'AGENT' && booking.agentId === actor.id;
      const isOwner = actor.role === 'USER' && booking.userId === actorId;

      if (!isAdmin && !isAssignedAgent && !isOwner) {
        throw new ForbiddenException('You are not allowed to update this booking');
      }

      if ((dto.pickupDate && !dto.dropoffDate) || (!dto.pickupDate && dto.dropoffDate)) {
        throw new BadRequestException(
          'Both pickupDate and dropoffDate are required when updating dates',
        );
      }

      const nextVehicleId = dto.vehicleId ?? booking.vehicleId;
      const dateRangeChanged = Boolean(dto.pickupDate && dto.dropoffDate);

      let pickupDate = booking.pickupDate;
      let dropoffDate = booking.dropoffDate;

      if (dateRangeChanged && dto.pickupDate && dto.dropoffDate) {
        const normalized = this.normalizeRequestedRange(
          dto.pickupDate,
          dto.dropoffDate,
        );
        pickupDate = normalized.pickupDate;
        dropoffDate = normalized.dropoffDate;
      }

      if (dto.pickupDate || dto.dropoffDate || dto.vehicleId) {
        await this.lockVehicleRow(tx, nextVehicleId);

        const conflict = await this.findOverlappingBooking(
          tx,
          nextVehicleId,
          pickupDate,
          dropoffDate,
          bookingId,
        );

        const canOverrideConflict = Boolean(dto.allowConflictOverride && isAdmin);

        if (conflict && !canOverrideConflict) {
          throw new ConflictException(
            'Vehicle already booked for the selected dates',
          );
        }
      }

      const nextVehicle = await tx.vehicle.findUnique({
        where: { id: nextVehicleId },
        select: { pricePerDay: true, pricePerHour: true, availability: true },
      });

      if (!nextVehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      if (!nextVehicle.availability) {
        throw new ConflictException('Vehicle is currently unavailable');
      }

      const updateData: Prisma.BookingUpdateInput = {
        vehicle: { connect: { id: nextVehicleId } },
        pickupDate,
        dropoffDate,
        totalAmount: this.calculateTotalAmount(
          pickupDate,
          dropoffDate,
          nextVehicle.pricePerDay,
          nextVehicle.pricePerHour,
        ),
      };

      if (dto.options !== undefined) {
        updateData.options = this.normalizeBookingOptions(dto.options);
      }

      if (dto.status && isAdmin) {
        updateData.status = dto.status as BookingStatus;
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: updateData,
      });
    });
  }

  async rebook(
    actor: { id?: string; sub?: string; role: string },
    sourceBookingId: string,
    dto: RebookBookingDto,
  ) {
    const userId = actor.id ?? actor.sub;
    if (!userId) {
      throw new ForbiddenException('Invalid authenticated user');
    }

    const sourceBooking = await this.prisma.booking.findUnique({
      where: { id: sourceBookingId },
      include: {
        vehicle: {
          select: {
            id: true,
            availability: true,
            pricePerDay: true,
            pricePerHour: true,
          },
        },
      },
    });

    if (!sourceBooking) {
      throw new NotFoundException('Booking not found');
    }

    if (sourceBooking.userId !== userId) {
      throw new ForbiddenException('You can only rebook your own bookings');
    }

    if (!sourceBooking.vehicle.availability) {
      throw new ConflictException('Vehicle is currently unavailable');
    }

    const sourceDurationMs =
      sourceBooking.dropoffDate.getTime() - sourceBooking.pickupDate.getTime();

    const requestedPickupDate = dto.pickupDate
      ? new Date(dto.pickupDate)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const requestedDropoffDate = dto.dropoffDate
      ? new Date(dto.dropoffDate)
      : new Date(requestedPickupDate.getTime() + sourceDurationMs);

    const { pickupDate, dropoffDate } = this.normalizeRequestedRange(
      requestedPickupDate.toISOString(),
      requestedDropoffDate.toISOString(),
    );

    const overlappingBooking = await this.findOverlappingBooking(
      this.prisma,
      sourceBooking.vehicleId,
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
      sourceBooking.vehicle.pricePerDay,
      sourceBooking.vehicle.pricePerHour,
    );

    return this.prisma.booking.create({
      data: {
        userId,
        vehicleId: sourceBooking.vehicleId,
        pickupDate,
        dropoffDate,
        totalAmount,
        options: this.normalizeBookingOptions(
          dto.options ?? sourceBooking.options,
        ),
      },
      include: {
        vehicle: true,
      },
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
