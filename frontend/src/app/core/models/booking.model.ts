import { BookingStatus } from './booking-status.enum';

export interface BookingConflictCheckResult {
  isAvailable: boolean;
  hasConflict: boolean;
  conflictingBookingId: string | null;
}

export interface BookingAvailabilitySlot {
  bookingId: string;
  pickupDate: string;
  dropoffDate: string;
  status: 'PENDING' | 'CONFIRMED';
}

export interface BookingAvailabilityCalendar {
  vehicleId: string;
  from: string;
  to: string;
  isCurrentlyAvailable: boolean;
  blockedSlots: BookingAvailabilitySlot[];
}

export interface BookingUpdatePayload {
  vehicleId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  options?: Record<string, unknown>;
  allowConflictOverride?: boolean;
  status?: BookingStatus;
}

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

export interface BookingCalendarDay {
  date: string;
  weekday: string;
  label: string;
  isToday: boolean;
  isPast: boolean;
  isBlocked: boolean;
  isInSelectedRange: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isSelectable: boolean;
}
