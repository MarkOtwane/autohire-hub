import { IsEmail, IsString } from 'class-validator';

export class LoginAgentDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
