import { IsEnum } from 'class-validator';

export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PICKED_UP = 'PICKED_UP',
  RETURNED = 'RETURNED',
}

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
