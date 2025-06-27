import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // Try Admin
    let user = await this.prisma.admin.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.agent.findUnique({ where: { email } });
    }
    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return { id: user.id, email: user.email, role: user.role || 'AGENT' };
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user,
    };
  }
}
