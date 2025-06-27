/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { PaymentsService } from './payment.service';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @Roles('USER')
  create(@Body() dto: CreatePaymentDto, @Req() req) {
    return this.service.create(req.user.id, dto);
  }

  @Get('me')
  @Roles('USER')
  getMyPayments(@Req() req) {
    return this.service.getUserPayments(req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'MAIN_ADMIN')
  getAll(@Query() dto: FilterPaymentDto) {
    return this.service.getAll(dto);
  }

  @Get(':id')
  @Roles('ADMIN', 'MAIN_ADMIN')
  getOne(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
