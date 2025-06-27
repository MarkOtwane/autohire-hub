import { IsOptional, IsString } from 'class-validator';

export class FilterPaymentDto {
  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
