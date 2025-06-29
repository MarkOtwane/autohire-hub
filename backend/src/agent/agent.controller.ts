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
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { AgentService } from './agent.service';
import { LoginAgentDto } from './dto/login-agent.dto';
import { ReportIssueDto } from './dto/report-issue.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('login')
  @UseGuards()
  login(@Body() dto: LoginAgentDto) {
    return this.agentService.login(dto);
  }

  @Get('bookings')
  getMyBookings(@Req() req) {
    return this.agentService.getMyBookings(req.user.id);
  }

  @Patch('bookings/:id/status')
  updateStatus(
    @Param('id') bookingId: string,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.agentService.updateBookingStatus(bookingId, dto, req.user.id);
  }

  @Post('issues')
  report(@Req() req, @Body() dto: ReportIssueDto) {
    return this.agentService.reportIssue(req.user.id, dto);
  }

  @Get('stats')
  getStats(@Req() req) {
    return this.agentService.getStats(req.user.id);
  }
}
