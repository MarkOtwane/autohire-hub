import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      select: {
        id: true,
        userId: true,
        totalAmount: true,
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only pay for your own booking');
    }

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.REJECTED
    ) {
      throw new BadRequestException('This booking cannot be paid');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: dto.bookingId },
      select: { id: true },
    });

    if (existingPayment) {
      throw new ConflictException('Payment already exists for this booking');
    }

    if (Math.abs(dto.amount - booking.totalAmount) > 0.01) {
      throw new BadRequestException(
        'Payment amount does not match booking total',
      );
    }

    const fakeReceipt = `https://example.com/receipt/${dto.bookingId}`;

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          userId,
          bookingId: dto.bookingId,
          provider: dto.provider,
          amount: dto.amount,
          status: 'PAID',
          receiptUrl: fakeReceipt,
        },
      }),
      this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      }),
    ]);

    return payment;
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { booking: true },
    });
  }

  async getAll(dto: FilterPaymentDto) {
    return this.prisma.payment.findMany({
      where: {
        provider: dto.provider,
        status: dto.status,
      },
    });
  }

  async getById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true, user: true },
    });
  }
}
