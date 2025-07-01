import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingsModule } from '../booking/booking.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [PrismaModule, BookingsModule],
})
export class UserModule {}
