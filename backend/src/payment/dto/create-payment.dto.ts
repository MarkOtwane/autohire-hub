import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @MinLength(2)
  provider: string; // SimPay, TestPay
}
