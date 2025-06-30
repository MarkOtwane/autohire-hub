import { Role } from './role.enum';
import { Notification } from './notification.model';

export interface User {
  id: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhoto?: string;
  notifications?: Notification[];
}
