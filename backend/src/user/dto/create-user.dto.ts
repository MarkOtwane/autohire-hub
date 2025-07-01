// src/user/dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Role } from '@prisma/client'; // Import Role enum from Prisma client

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Assuming 'name' is a required field for user creation

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' }) // Example min-length
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // Allow setting role, but typically defaults to USER in registration

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsUrl()
  profilePhoto?: string;
}
