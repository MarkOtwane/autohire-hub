import { IsString, IsNotEmpty } from 'class-validator';

export class ReportIssueDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
