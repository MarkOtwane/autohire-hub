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
import { Roles } from 'src/commons/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RespondTicketDto } from './dto/response-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SupportService } from './support.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @Roles('USER')
  create(@Body() dto: CreateTicketDto, @Req() req) {
    return this.supportService.create(req.user.id, dto);
  }

  @Get('mine')
  @Roles('USER')
  getMine(@Req() req) {
    return this.supportService.getMyTickets(req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'MAIN_ADMIN')
  getAll() {
    return this.supportService.getAllTickets();
  }

  @Patch(':id/respond')
  @Roles('ADMIN', 'MAIN_ADMIN')
  respond(@Param('id') id: string, @Body() dto: RespondTicketDto) {
    return this.supportService.respond(id, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MAIN_ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.supportService.updateStatus(id, dto.status);
  }
}
