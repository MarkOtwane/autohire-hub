import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService],
})
export class BookingsModule {}

export class BookingModule {}
