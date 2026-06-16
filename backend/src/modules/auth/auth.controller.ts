import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/verify')
  @ApiOperation({ summary: 'Xác thực Google Token từ Frontend' })
  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  async verifyGoogleToken(@Body('token') token: string) {
    const accessToken = await this.authService.verifyGoogleIdToken(token);
    return { access_token: accessToken };
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Khởi tạo đăng nhập bằng Google' })
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback sau khi Google xác thực xong' })
  googleAuthRedirect(@Req() req, @Res() res) {
    const token = req.user;
    // Chuyển hướng về Frontend kèm token (Frontend xử lý lưu token)
    return res.redirect(`http://localhost:8000/login/success?token=${token}`);
  }
}
