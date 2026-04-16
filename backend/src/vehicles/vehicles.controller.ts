import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../commons/guards/jwt-auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { SearchVehicleDto } from './dto/search-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleCalendarQueryDto } from './dto/vehicle-calendar-query.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('search')
  search(@Query() dto: SearchVehicleDto) {
    return this.vehiclesService.search(dto);
  }

  @Get(':id/calendar')
  getCalendar(
    @Param('id') id: string,
    @Query() query: VehicleCalendarQueryDto,
  ) {
    return this.vehiclesService.getAvailabilityCalendar(id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MAIN_ADMIN')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
