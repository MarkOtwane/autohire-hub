export interface Vehicle {
  id: string;
  name: string;
  description: string;
  category: 'SUV' | 'SEDAN' | 'ECONOMY' | 'LUXURY' | 'PICKUP' | 'VAN';
  pricePerDay: number;
  pricePerHour: number;
  availability: boolean;
  location: string;
  transmission: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  features: string[]; 
  imageUrl?: string; 
  createdAt: Date;
}


export interface CreateVehicleDto {
  name: string;
  description: string;
  category: 'SUV' | 'SEDAN' | 'ECONOMY' | 'LUXURY' | 'PICKUP' | 'VAN';
  pricePerDay: number;
  pricePerHour: number;
  location: string;
  transmission: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  features: string[];
  imageUrl?: string;
}


export interface UpdateVehicleDto {
  name?: string;
  description?: string;
  category?: 'SUV' | 'SEDAN' | 'ECONOMY' | 'LUXURY' | 'PICKUP' | 'VAN';
  pricePerDay?: number;
  pricePerHour?: number;
  availability?: boolean;
  location?: string;
  transmission?: string;
  fuelType?: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  features?: string[];
  imageUrl?: string;
}
