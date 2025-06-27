import { PasswordResetToken, Role } from 'generated/prisma';

export class AdminEntity {
  id: string;
  email: string;
  password: string;
  role: Role;
  isMainAdmin: boolean;
  createdAt: Date;
  resetTokens: PasswordResetToken[];
  notifications: Notification[];
}
