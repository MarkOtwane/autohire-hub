import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['OPEN', 'RESOLVED'])
  status: string;
}
