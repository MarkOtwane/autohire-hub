import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
// Define FuelType enum locally if not exported from @prisma/client
export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  OTHER = 'OTHER',
}

export enum VehicleCategory {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  COUPE = 'COUPE',
  CONVERTIBLE = 'CONVERTIBLE',
  WAGON = 'WAGON',
  VAN = 'VAN',
  PICKUP = 'PICKUP',
  OTHER = 'OTHER',
}

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

  @IsString()
  location: string;

  @IsString()
  transmission: string;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
