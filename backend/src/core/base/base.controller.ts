import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseService } from './base.service';
import { BaseEntity } from './base.entity';
import type { DeepPartial } from 'typeorm';

export abstract class BaseController<T extends BaseEntity> {
  constructor(protected readonly baseService: BaseService<T>) {}

  @Get('page')
  @ApiOperation({ summary: 'Lấy danh sách có phân trang' })
  async getPage(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() query: any,
  ) {
    // Remove page and limit from query for options
    const { page: _p, limit: _l, ...options } = query;
    return this.baseService.findPaginated(page, limit, options);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy tất cả bản ghi' })
  async getAll(@Query() query: any) {
    return this.baseService.findAll(query);
  }

  @Get('one')
  @ApiOperation({ summary: 'Lấy một bản ghi theo điều kiện' })
  async getOne(@Query('condition') condition: any) {
    const parsedCondition = typeof condition === 'string' ? JSON.parse(condition) : condition;
    return this.baseService.findOne(parsedCondition);
  }

  @Get('import/headers')
  @ApiOperation({ summary: 'Lấy headers cho import' })
  async getImportHeaders(@Query() query: any) {
    return this.baseService.getImportHeaders(query);
  }

  @Get('import/template')
  @ApiOperation({ summary: 'Lấy file mẫu import' })
  async getImportTemplate(@Query() query: any) {
    return this.baseService.getImportTemplate(query);
  }

  @Post('import/validate')
  @ApiOperation({ summary: 'Kiểm tra dữ liệu import' })
  async validateImport(@Body('rows') rows: any[]) {
    return this.baseService.validateImport(rows);
  }

  @Post('import/execute')
  @ApiOperation({ summary: 'Thực thi import dữ liệu' })
  async executeImport(@Body('rows') rows: any[]) {
    return this.baseService.executeImport(rows);
  }

  @Get('export/fields')
  @ApiOperation({ summary: 'Lấy các trường để export' })
  async getExportFields(@Query() query: any) {
    return this.baseService.getExportFields(query);
  }

  @Post('export/execute')
  @ApiOperation({ summary: 'Thực thi export dữ liệu' })
  async executeExport(@Body() payload: any) {
    return this.baseService.executeExport(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bản ghi' })
  async getById(@Param('id') id: string) {
    return this.baseService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới bản ghi' })
  async create(@Body() createDto: DeepPartial<T>) {
    return this.baseService.create(createDto);
  }

  @Put('many')
  @ApiOperation({ summary: 'Cập nhật nhiều bản ghi' })
  async updateMany(
    @Body('ids') ids: string[],
    @Body('payload') updateDto: DeepPartial<T>,
  ) {
    return this.baseService.updateMany(ids, updateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật một bản ghi' })
  async update(@Param('id') id: string, @Body() updateDto: DeepPartial<T>) {
    return this.baseService.update(id, updateDto);
  }

  @Delete('many')
  @ApiOperation({ summary: 'Xóa nhiều bản ghi' })
  async deleteMany(@Body('ids') ids: string[]) {
    await this.baseService.deleteMany(ids);
    return { deletedCount: ids.length };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bản ghi' })
  async delete(@Param('id') id: string) {
    await this.baseService.delete(id);
    return true;
  }
}
