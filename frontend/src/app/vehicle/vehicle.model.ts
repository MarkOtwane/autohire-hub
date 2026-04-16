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

export interface SearchVehicleParams {
  location?: string;
  category?: 'SUV' | 'SEDAN' | 'ECONOMY' | 'LUXURY' | 'PICKUP' | 'VAN' | '';
  fuelType?: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | '';
  transmission?: string;
  minPricePerDay?: number | null;
  maxPricePerDay?: number | null;
  availableOnly?: boolean;
  keyword?: string;
}

export interface VehicleCalendarSlot {
  bookingId: string;
  pickupDate: string;
  dropoffDate: string;
  status: 'PENDING' | 'CONFIRMED';
}

export interface VehicleCalendar {
  vehicleId: string;
  from: string;
  to: string;
  isCurrentlyAvailable: boolean;
  blockedSlots: VehicleCalendarSlot[];
}
