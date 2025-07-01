import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './booking/booking.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notification/notification.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PaymentsModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupportModule } from './support/support.module';
import { UserModule } from './user/user.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AdminModule,
    UserModule,
    AgentModule,
    VehiclesModule,
    AuthModule,
    BookingsModule,
    PaymentsModule,
    NotificationsModule,
    SupportModule,
    MetricsModule,
    AuditModule,
    PrismaModule,
    PasswordResetModule,
    ConfigModule.forRoot({
      isGlobal: true, // ✅ this ensures .env variables are loaded everywhere
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
