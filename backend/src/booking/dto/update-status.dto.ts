import { IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
