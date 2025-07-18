import { Module } from '@nestjs/common';
import { PrismaController } from './prisma.controller';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

export { PrismaService };
