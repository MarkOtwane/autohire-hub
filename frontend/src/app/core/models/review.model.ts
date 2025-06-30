export interface Review {
  id: string;
  userId: string;
  vehicleId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
