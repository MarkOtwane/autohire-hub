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
import { UpdatePasswordDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.tdo';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
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
