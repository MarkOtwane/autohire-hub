/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(params: {
    actorId: string;
    actorRole: string;
    action: string;
    target?: string;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        actorRole: params.actorRole as Role,
        action: params.action,
        target: params.target,
        metadata: params.metadata,
      },
    });
  }

  async getLogs(limit = 100) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
