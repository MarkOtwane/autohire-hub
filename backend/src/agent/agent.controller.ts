/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { AgentService } from './agent.service';
import { LoginAgentDto } from './dto/login-agent.dto';
import { ReportIssueDto } from './dto/report-issue.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('login')
  login(@Body() dto: LoginAgentDto) {
    return this.agentService.login(dto);
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AGENT')
  getMyBookings(@Req() req) {
    return this.agentService.getMyBookings(req.user.id);
  }

  @Patch('bookings/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AGENT')
  updateStatus(
    @Param('id') bookingId: string,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.agentService.updateBookingStatus(bookingId, dto, req.user.id);
  }

  @Post('issues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AGENT')
  report(@Req() req, @Body() dto: ReportIssueDto) {
    return this.agentService.reportIssue(req.user.id, dto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('AGENT')
  getStats(@Req() req) {
    return this.agentService.getStats(req.user.id);
  }
}
