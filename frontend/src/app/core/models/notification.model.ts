export interface Notification {
  id: string;
  adminId?: string;
  userId?: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
