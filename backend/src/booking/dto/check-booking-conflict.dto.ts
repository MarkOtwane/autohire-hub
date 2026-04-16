import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CheckBookingConflictDto {
  @IsString()
  vehicleId: string;

  @IsDateString()
  pickupDate: string;

  @IsDateString()
  dropoffDate: string;

  @IsOptional()
  @IsString()
  excludeBookingId?: string;
}
