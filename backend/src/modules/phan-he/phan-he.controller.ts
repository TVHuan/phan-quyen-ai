import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { PhanHeEntity } from './phan-he.entity';
import { PhanHeService } from './phan-he.service';

@ApiTags('phan-he')
@Controller('phan-he')
export class PhanHeController extends BaseController<PhanHeEntity> {
  constructor(service: PhanHeService) {
    super(service);
  }
}
