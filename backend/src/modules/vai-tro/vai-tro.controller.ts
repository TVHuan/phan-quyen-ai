import { Controller, Get, Put, Param, Query, Body, Delete, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { VaiTroEntity } from './vai-tro.entity';
import { VaiTroService } from './vai-tro.service';
import { VaiTroChucNangService } from '../vai-tro-chuc-nang/vai-tro-chuc-nang.service';

@ApiTags('vai-tro')
@Controller('vai-tro')
export class VaiTroController extends BaseController<VaiTroEntity> {
  constructor(
    private readonly vaiTroService: VaiTroService,
    private readonly vaiTroChucNangService: VaiTroChucNangService,
  ) {
    super(vaiTroService);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy tất cả vai trò (có thể lọc theo phân hệ)' })
  async getAll(@Query('phanHeId') phanHeId?: string) {
    if (phanHeId) {
      return this.vaiTroService.findAllByPhanHe(phanHeId);
    }
    return this.vaiTroService.findAll();
  }

  @Get(':id/chuc-nang')
  @ApiOperation({ summary: 'Lấy danh sách chức năng đã gán cho vai trò' })
  async getChucNang(@Param('id') id: string) {
    return this.vaiTroChucNangService.getChucNangByVaiTro(id);
  }

  @Put(':id/chuc-nang')
  @ApiOperation({ summary: 'Cập nhật danh sách chức năng cho vai trò' })
  async updateChucNang(
    @Param('id') id: string,
    @Body('chucNangIds') chucNangIds: string[],
  ) {
    await this.vaiTroChucNangService.updateChucNangForVaiTro(id, chucNangIds);
    return this.vaiTroChucNangService.getChucNangByVaiTro(id);
  }
}
