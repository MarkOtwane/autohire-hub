import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AgentController],
  providers: [AgentService, PrismaService],
})
export class AgentModule {}
