import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardController } from './dashboard.controller';
import { MetricsService } from './metrics.service';

@Module({
  controllers: [DashboardController],
  providers: [MetricsService, PrismaService],
})
export class MetricsModule {}
