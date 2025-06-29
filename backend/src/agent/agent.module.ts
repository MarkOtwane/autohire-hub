/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AgentController],
  providers: [AgentService, PrismaService],
})
export class AgentModule {}
