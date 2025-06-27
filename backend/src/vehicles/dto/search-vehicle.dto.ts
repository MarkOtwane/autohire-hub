import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum VehicleCategory {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  // Add other categories as needed
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  // Add other fuel types as needed
}
export class CreateVehicleDto {
  @IsEnum(VehicleCategory)
  category: string;

  @IsEnum(FuelType)
  fuelType: FuelType;
}

export class SearchVehicleDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory;

  @IsOptional()
  @IsString()
  keyword?: string;
}
