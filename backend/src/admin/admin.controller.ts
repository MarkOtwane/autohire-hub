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
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.tdo';
import { UpdatePasswordDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @Post('agent')
  @UseGuards(JwtAuthGuard)
  createAgent(@Body() dto: CreateAgentDto, @Req() req) {
    return this.adminService.createAgent(dto, req.user.id);
  }

  @Get('agents')
  @UseGuards(JwtAuthGuard)
  getAgents() {
    return this.adminService.getAgents();
  }

  @Patch('agent/:id/status')
  @UseGuards(JwtAuthGuard)
  toggleAgent(@Param('id') id: string, @Body() body: { active: boolean }) {
    return this.adminService.toggleAgentStatus(id, body.active);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  create(@Body() dto: CreateAdminDto, @Req() req) {
    return this.adminService.createAdmin(dto, req.user.sub); // Changed req.user.id to req.user.sub
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.adminService.updatePassword(req.user.sub, dto); // Changed req.user.id to req.user.sub
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.adminService.deleteAdmin(id, req.user.sub); // Changed req.user.id to req.user.sub
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(@Req() req) {
    return this.adminService.getAllAdmins(req.user.sub); // Changed req.user.id to req.user.sub
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.adminService.getProfile(req.user.sub); // Changed req.user.id to req.user.sub
  }
}
