import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { SupportModule } from './support/support.module';
import { UserModule } from './user/user.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PrismaModule } from './prisma/prisma.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    AgentModule,
    VehiclesModule,
    AuthModule,
    BookingModule,
    PaymentModule,
    NotificationModule,
    SupportModule,
    MetricsModule,
    AuditModule,
    PrismaModule,
    PasswordResetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
