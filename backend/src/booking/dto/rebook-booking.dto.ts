import { IsDateString, IsObject, IsOptional } from 'class-validator';

export class RebookBookingDto {
  @IsOptional()
  @IsDateString()
  pickupDate?: string;

  @IsOptional()
  @IsDateString()
  dropoffDate?: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>;
}
