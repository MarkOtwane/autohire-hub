import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule {}
