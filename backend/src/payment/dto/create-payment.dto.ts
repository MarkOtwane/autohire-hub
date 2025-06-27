import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsString()
  provider: string; // SimPay, TestPay
}
