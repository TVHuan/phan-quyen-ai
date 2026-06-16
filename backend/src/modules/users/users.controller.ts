import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<UserEntity> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại' })
  getMe(@Req() req) {
    return req.user;
  }
}
