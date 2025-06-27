import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const fakeReceipt = `https://example.com/receipt/${dto.bookingId}`;

    return this.prisma.payment.create({
      data: {
        ...dto,
        status: 'PAID',
        receiptUrl: fakeReceipt,
        userId,
      },
    });
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
