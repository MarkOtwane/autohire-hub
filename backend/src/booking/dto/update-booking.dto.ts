import { PartialType } from '@nestjs/mapped-types';
import { BookingStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsBoolean()
  allowConflictOverride?: boolean;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
