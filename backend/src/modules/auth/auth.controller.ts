import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', example: 'admin20k' },
        password: { type: 'string', example: 'abc123' },
        email: { type: 'string', example: 'admin@example.com' },
        firstName: { type: 'string', example: 'Admin' },
        lastName: { type: 'string', example: '' },
      },
      required: ['username', 'password'],
    },
  })
  @HttpCode(201)
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email?: string,
    @Body('firstName') firstName?: string,
    @Body('lastName') lastName?: string,
  ) {
    return this.authService.register({ username, password, email, firstName, lastName });
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập bằng username và password' })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', example: 'admin20k' },
        password: { type: 'string', example: 'abc123' },
      },
      required: ['username', 'password'],
    },
  })
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login({ username, password });
  }
}
