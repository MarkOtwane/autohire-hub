import { BookingStatus } from './booking-status.enum';

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  agentId?: string;
  status: BookingStatus;
  pickupDate: string;
  dropoffDate: string;
  totalAmount: number;
  options?: any;
  createdAt: string;
}
