import { IsOptional, IsEnum, IsString } from 'class-validator';

// Define VehicleCategory enum locally if not exported from @prisma/client
export enum VehicleCategory {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  // Add other categories as needed
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
