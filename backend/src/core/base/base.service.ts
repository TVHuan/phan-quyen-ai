import { Repository, DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: any): Promise<T[]> {
    return this.repository.find(options);
  }

  async findPaginated(page: number = 1, limit: number = 10, options?: any): Promise<{ result: T[]; total: number }> {
    const [result, total] = await this.repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { result, total };
  }

  async findOne(options: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repository.findOne({ where: options });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy bản ghi');
    }
    return entity;
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy bản ghi');
    }
    return entity;
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    this.repository.merge(entity, updateDto);
    return this.repository.save(entity);
  }

  async updateMany(ids: string[], updateDto: DeepPartial<T>): Promise<any> {
    return this.repository.update({ id: In(ids) as any }, updateDto as any);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.softRemove(entity); // Sử dụng soft delete
  }

  async deleteMany(ids: string[]): Promise<void> {
    const entities = await this.repository.findBy({ id: In(ids) as any });
    await this.repository.softRemove(entities);
  }

  // Base Import/Export Dummies
  async getImportHeaders(query?: any) {
    return [];
  }
  
  async getImportTemplate(query?: any) {
    return {};
  }
  
  async validateImport(rows: any[]) {
    return [];
  }
  
  async executeImport(rows: any[]) {
    return [];
  }
  
  async getExportFields(query?: any) {
    return [];
  }
  
  async executeExport(payload: any) {
    return null;
  }
}
