/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { Roles } from '../commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { LoginAdminDto } from './dto/login-admin.tdo';
import { UpdatePasswordDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: LoginAdminDto): Promise<any> {
    return this.adminService.login(dto);
  }

  @Post('agents')
  @Roles('MAIN_ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAgent(@Body() dto: CreateAgentDto, @Req() req): Promise<any> {
    return this.adminService.createAgent(dto, req.user.sub);
  }

  @Get('agents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getAgents(): Promise<any> {
    return this.adminService.getAgents();
  }

  @Patch('agent/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  toggleAgent(
    @Param('id') id: string,
    @Body() body: { active: boolean },
  ): Promise<any> {
    return this.adminService.toggleAgentStatus(id, body.active);
  }

  @Delete('agent/:id')
  @Roles('MAIN_ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteAgent(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteAgent(id);
  }

  @Get('vehicles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getVehicles(): Promise<any> {
    return this.adminService.getVehicles();
  }

  @Post('vehicles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  createVehicle(@Body() dto: any): Promise<any> {
    return this.adminService.createVehicle(dto);
  }

  @Patch('vehicles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  updateVehicle(@Param('id') id: string, @Body() dto: any): Promise<any> {
    return this.adminService.updateVehicle(id, dto);
  }

  @Delete('vehicles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  deleteVehicle(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteVehicle(id);
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getBookings(): Promise<any> {
    return this.adminService.getBookings();
  }

  @Patch('bookings/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: { status: string },
  ): Promise<any> {
    return this.adminService.updateBookingStatus(
      id,
      dto.status as BookingStatus,
    );
  }

  @Post('notifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  sendNotification(
    @Body() dto: { userId?: string; message: string; type: string },
  ): Promise<any> {
    return this.adminService.sendNotification(dto);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getNotifications(): Promise<any> {
    return this.adminService.getNotifications();
  }

  @Patch('notifications/:id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  markNotificationAsRead(@Param('id') id: string): Promise<any> {
    return this.adminService.markNotificationAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @Roles('MAIN_ADMIN')
  create(@Body() dto: CreateAdminDto, @Req() req): Promise<any> {
    return this.adminService.createAdmin(dto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('change-password')
  @Roles('ADMIN', 'MAIN_ADMIN')
  changePassword(@Req() req, @Body() dto: UpdatePasswordDto): Promise<any> {
    return this.adminService.updatePassword(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('MAIN_ADMIN')
  delete(@Req() req, @Param('id') id: string): Promise<any> {
    return this.adminService.deleteAdmin(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('MAIN_ADMIN')
  getAll(@Req() req): Promise<any> {
    return this.adminService.getAllAdmins(req.user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getProfile(@Req() req): Promise<any> {
    return this.adminService.getProfile(req.user.sub);
  }

  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  getDashboardStats(): Promise<any> {
    return this.adminService.getDashboardStats();
  }
}
