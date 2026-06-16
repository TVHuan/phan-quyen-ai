# 📖 Hướng Dẫn Code Chuẩn Base (Backend - NestJS)

Tài liệu này cung cấp hướng dẫn toàn diện cho việc phát triển Backend dựa trên kiến trúc **BaseWebV1** bằng NestJS + TypeORM. Mục tiêu là đảm bảo tính đồng bộ, và tận dụng tối đa Base CRUD tự động mà không phải viết lại code lặp lại.

---

## 🏗 Cấu Trúc Mã Nguồn (Folder Structure)

Việc đặt file và cấu trúc thư mục đúng quy định là **bắt buộc** để giữ cho dự án gọn gàng và dễ bảo trì.

- `src/modules/[TenModule]`: Chứa các module chức năng. Trong mỗi module chuẩn CRUD gồm 4 file cơ bản:
  - `[tên].module.ts`: Khai báo controller, service và entity vào TypeORM.
  - `[tên].controller.ts`: Nơi định nghĩa các API routes.
  - `[tên].service.ts`: Xử lý logic nghiệp vụ và tương tác database.
  - `[tên].entity.ts`: Khai báo bảng database với TypeORM.
- `src/core/base/`: Chứa các file `base.controller.ts`, `base.service.ts`, `base.entity.ts`. **Tuyệt đối không sửa code trong thư mục này** nếu không có thống nhất toàn hệ thống.

---

## ⚡ Hướng Dẫn Làm Nhanh CRUD

Backend đã hỗ trợ sẵn các thao tác CRUD cơ bản nhất (Phân trang, Tạo, Cập nhật, Xóa, Cập nhật nhiều, Xóa nhiều, Import/Export cơ bản). 

**Cách code đúng chuẩn Base:**
Đừng bao giờ viết lại các API như `getPage()`, `getById()`, `create()`, `update()`, `delete()` trong controller trừ khi có logic cực kỳ đặc biệt. Thay vào đó, hãy kế thừa từ các class Base:

### Bước 1: Tạo Entity
Entity bắt buộc phải `extends BaseEntity` để kế thừa sẵn các cột `id` (uuid), `created_at`, `updated_at`, `deleted_at` (hỗ trợ tính năng soft delete).
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('danh_muc_khoa')
export class KhoaEntity extends BaseEntity {
  @Column({ name: 'ten_khoa', length: 255 })
  tenKhoa: string;

  @Column({ name: 'ma_khoa', unique: true })
  maKhoa: string;
}
```

### Bước 2: Tạo Service
Service `extends BaseService<T>` và truyền repository vào.
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { KhoaEntity } from './khoa.entity';

@Injectable()
export class KhoaService extends BaseService<KhoaEntity> {
  constructor(
    @InjectRepository(KhoaEntity)
    private readonly khoaRepo: Repository<KhoaEntity>,
  ) {
    super(khoaRepo); // Truyền xuống base để tự động hóa các hàm chuẩn
  }
  
  // Bạn chỉ viết thêm các logic nghiệp vụ phức tạp ở đây (VD: Thống kê, Xử lý custom)
}
```

### Bước 3: Tạo Controller
Controller `extends BaseController<T>` để tự động có toàn bộ API endpoint chuẩn được map trực tiếp sang giao diện frontend qua hook `useInitModel`.
```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { KhoaEntity } from './khoa.entity';
import { KhoaService } from './khoa.service';

@ApiTags('Danh mục khoa')
@Controller('khoa') // Router endpoint: /api/khoa
export class KhoaController extends BaseController<KhoaEntity> {
  constructor(private readonly khoaService: KhoaService) {
    super(khoaService);
  }
  
  // Nếu có endpoint nào nằm ngoài quy chuẩn CRUD thì mới định nghĩa thêm ở đây
}
```

---

## ⚖️ Quy Tắc Chung (Naming & Code Conventions)

1. **Naming Conventions:**
   - Tên file Backend: Bắt buộc dùng `kebab-case` kèm theo hậu tố chuẩn NestJS. VD: `user.controller.ts`, `user.service.ts`, `user.entity.ts`.
   - Tên Class: Viết hoa chữ cái đầu (PascalCase), VD: `UserController`, `UserEntity`.
   - Tên phương thức, biến: Viết thường chữ cái đầu (camelCase), VD: `findAllUsers()`, `userId`.
   
2. **Lưu ý khi mở rộng Base Controller:**
   - Nếu Controller cần viết 1 route mới không có trong `BaseController`, hãy thêm phương thức kèm theo decorator `@Get('path')` hoặc `@Post('path')` bên dưới constructor trong `[name].controller.ts`.
   - Tránh việc sửa đổi mã nguồn gốc của thư mục `src/core/base` để không làm phá vỡ logic chung của các module khác đang kế thừa base này.
