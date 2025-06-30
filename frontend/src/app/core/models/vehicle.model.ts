import { VehicleCategory } from './vehicle-category.enum';
import { FuelType } from './fuel-type.enum';

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  category: VehicleCategory;
  pricePerDay: number;
  pricePerHour: number;
  availability: boolean;
  location: string;
  transmission: string;
  fuelType: FuelType;
  features: string[];
  imageUrl?: string;
  createdAt: string;
}
