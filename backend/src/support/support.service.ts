import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RespondTicketDto } from './dto/response-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        ...dto,
        status: 'OPEN',
      },
    });
  }

  async getMyTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTickets() {
    return this.prisma.supportTicket.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respond(ticketId: string, dto: RespondTicketDto) {
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        response: dto.response,
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }

  async updateStatus(ticketId: string, status: string) {
    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
      },
    });
  }
}
