import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notification/notification.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AgreementsController } from './agreements.controller';
import { AgreementsService } from './agreements.service';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
