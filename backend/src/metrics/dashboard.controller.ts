import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { MetricsService } from './metrics.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('metrics')
export class DashboardController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('user')
  @Roles('USER')
  getUser(@Req() req) {
    return this.metricsService.getUserMetrics(req.user.id);
  }

  @Get('agent')
  @Roles('AGENT')
  getAgent(@Req() req) {
    return this.metricsService.getAgentMetrics(req.user.id);
  }

  @Get('admin')
  @Roles('ADMIN', 'MAIN_ADMIN')
  getAdmin() {
    return this.metricsService.getAdminDashboard();
  }
}
