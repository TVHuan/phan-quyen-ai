import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { ChucNangEntity } from './chuc-nang.entity';
import { ChucNangService, TreeNode } from './chuc-nang.service';

@ApiTags('chuc-nang')
@Controller('chuc-nang')
export class ChucNangController extends BaseController<ChucNangEntity> {
  constructor(private readonly chucNangService: ChucNangService) {
    super(chucNangService);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Lấy cây chức năng theo phân hệ' })
  @ApiQuery({ name: 'phanHeId', required: true })
  async getTree(@Query('phanHeId') phanHeId: string): Promise<TreeNode[]> {
    return this.chucNangService.getTree(phanHeId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy tất cả chức năng (có thể lọc theo phân hệ)' })
  async getAll(@Query('phanHeId') phanHeId?: string) {
    if (phanHeId) {
      return this.chucNangService.findAllByPhanHe(phanHeId);
    }
    return this.chucNangService.findAll();
  }
}
