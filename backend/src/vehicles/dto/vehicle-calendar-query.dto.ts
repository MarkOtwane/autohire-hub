import { IsDateString, IsOptional } from 'class-validator';

export class VehicleCalendarQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
