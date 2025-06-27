import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    // Try Admin
    const admini = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (admini) {
      const valid = await bcrypt.compare(password, admini.password);
      if (!valid) return null;
      return {
        id: admini.id,
        email: admini.email,
        role: admini.role || 'ADMIN',
      };
    }

    // Try Agent
    const agents = await this.prisma.agent.findUnique({ where: { email } });
    if (agents) {
      const valid = await bcrypt.compare(password, agents.password);
      if (!valid) return null;
      return {
        id: agents.id,
        email: agents.email,
        role: 'AGENT',
      };
    }

    // Try User
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return null;
      return { id: user.id, email: user.email, role: user.role || 'USER' };
    }

    return null;
  }
  async login(user: AuthUser) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
