import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PhanQuyenService } from './phan-quyen.service';
import { NguoiDungVaiTroService } from '../nguoi-dung-vai-tro/nguoi-dung-vai-tro.service';

@ApiTags('phan-quyen')
@Controller('phan-quyen')
export class PhanQuyenController {
  constructor(
    private readonly phanQuyenService: PhanQuyenService,
    private readonly nguoiDungVaiTroService: NguoiDungVaiTroService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy permissions của user hiện tại' })
  @ApiQuery({ name: 'phanHeId', required: false })
  async getMyPermissions(@Req() req: any, @Query('phanHeId') phanHeId?: string) {
    return this.phanQuyenService.getPermissions(req.user.id, phanHeId);
  }

  @Get('role/:ma/chuc-nang')
  @ApiOperation({ summary: 'Lấy scopes của một vai trò theo mã (dùng cho AI Simulator tra cứu)' })
  @ApiQuery({ name: 'phanHe', required: false, description: 'Mã phân hệ, VD: ai-mo-phong' })
  async getRolePermissions(
    @Param('ma') ma: string,
    @Query('phanHe') phanHe?: string,
  ) {
    return this.phanQuyenService.getPermissionsByRoleCode(ma, phanHe);
  }

  @Get('nguoi-dung/:userId/vai-tro')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy vai trò của người dùng' })
  @ApiQuery({ name: 'phanHeId', required: false })
  async getNguoiDungVaiTro(
    @Param('userId') userId: string,
    @Query('phanHeId') phanHeId?: string,
  ) {
    return this.nguoiDungVaiTroService.getVaiTroByNguoiDung(userId, phanHeId);
  }

  @Put('nguoi-dung/:userId/vai-tro')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật vai trò của người dùng trong phân hệ' })
  async updateNguoiDungVaiTro(
    @Param('userId') userId: string,
    @Body('phanHeId') phanHeId: string,
    @Body('vaiTroIds') vaiTroIds: string[],
  ) {
    await this.nguoiDungVaiTroService.updateVaiTroForNguoiDung(
      userId,
      phanHeId,
      vaiTroIds,
    );
    return this.nguoiDungVaiTroService.getVaiTroByNguoiDung(userId, phanHeId);
  }

  @Get('nguoi-dung/:userId/chuc-nang')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy toàn bộ scopes của người dùng' })
  @ApiQuery({ name: 'phanHeId', required: false })
  async getNguoiDungChucNang(
    @Param('userId') userId: string,
    @Query('phanHeId') phanHeId?: string,
  ) {
    return this.phanQuyenService.getPermissions(userId, phanHeId);
  }
}
