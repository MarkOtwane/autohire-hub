import { IsString } from 'class-validator';

export class RespondTicketDto {
  @IsString()
  response: string;
}
