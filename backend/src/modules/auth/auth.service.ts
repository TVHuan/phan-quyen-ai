import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: { username: string; password: string; email?: string; firstName?: string; lastName?: string }) {
    if (!payload.username || !payload.password) {
      throw new BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
    }

    const existing = await this.usersService.findByUsername(payload.username);
    if (existing) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.usersService.create({
      username: payload.username,
      password: hashedPassword,
      email: payload.email || undefined,
      firstName: payload.firstName || undefined,
      lastName: payload.lastName || undefined,
    });

    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return {
      access_token: token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async login(payload: { username: string; password: string }) {
    if (!payload.username || !payload.password) {
      throw new BadRequestException('Tên đăng nhập và mật khẩu không được để trống');
    }

    const user = await this.usersService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return {
      access_token: token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }
}
