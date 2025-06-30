import { Role } from './role.enum';
import { Notification } from './notification.model';

export interface Admin {
  id: string;
  email: string;
  password?: string;
  role: Role;
  isMainAdmin: boolean;
  createdAt: string;
  notifications?: Notification[];
}
