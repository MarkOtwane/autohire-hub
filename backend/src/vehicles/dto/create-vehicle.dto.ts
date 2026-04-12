import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { VehicleCategory, FuelType } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @IsNumber()
  pricePerDay: number;

  @IsNumber()
  pricePerHour: number;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsString()
  location: string;

  @IsString()
  transmission: string;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
