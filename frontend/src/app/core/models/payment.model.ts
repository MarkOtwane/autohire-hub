export interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  provider: string;
  amount: number;
  status: string;
  receiptUrl?: string;
  createdAt: string;
}
