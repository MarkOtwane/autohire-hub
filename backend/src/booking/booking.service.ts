import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        ...dto,
        userId,
        status: 'PENDING',
      },
    });
  }

  async findMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true },
    });
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true, agent: true, payment: true },
    });
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (booking?.userId !== userId) throw new ForbiddenException();
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
