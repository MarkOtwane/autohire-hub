import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAgentDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(6)
  password: string;
}
