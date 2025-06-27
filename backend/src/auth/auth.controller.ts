import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto) {
    const admin = await this.authService.validateAdmin(dto.email, dto.password);
    if (!admin) throw new UnauthorizedException('Invalid admin credentials');
    return this.authService.login(admin);
  }
}
