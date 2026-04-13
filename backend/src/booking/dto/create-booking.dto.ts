import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  vehicleId: string;

  @IsDateString()
  pickupDate: string;

  @IsDateString()
  dropoffDate: string;

  @IsOptional()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>; // insurance, extra driver, etc.
}
