import { IsEnum } from 'class-validator';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  // Add other statuses as needed
}

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
