import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module'; // adjust as needed
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService],
  exports: [BookingsService],
})
export class BookingsModule {}
