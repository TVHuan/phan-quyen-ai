# Base Backend - AI Mô Phỏng (NestJS + PostgreSQL)

Đây là base backend sử dụng **NestJS** với kiến trúc **Monolithic** phân tầng rõ ràng (Controller -> Service -> Repository), kết hợp **PostgreSQL** qua **TypeORM**, hỗ trợ generic CRUD và tự động hóa API docs bằng **Swagger**. 

Được thiết kế để chạy tương thích tuyệt đối với frontend `BaseWebV1` và hook `useInitModel`.

## 📦 Yêu cầu hệ thống
- Node.js >= 18
- **Yarn**
- PostgreSQL (database)

## 🛠️ Cài đặt & Chạy dự án

1. **Cài đặt thư viện:**
```bash
yarn install
```

2. **Cấu hình môi trường:**
Kiểm tra file `.env` ở thư mục gốc của backend và điền các thông tin:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ai_mo_phong
JWT_SECRET=super_secret_key_change_me_in_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
PORT=3000
```

> [!IMPORTANT]
> TypeORM đang bật `synchronize: true` trong `app.module.ts`. Database sẽ được tự động tạo bảng dựa trên Entity. Không cần tạo bảng tay bằng IDE.

3. **Chạy server (Dev mode có Hot-reload):**
```bash
yarn run start:dev
```

## 📖 Swagger API Docs
Sau khi chạy server, truy cập Swagger UI để test API tại:
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🏗 Hướng dẫn tạo module CRUD mới bằng Base Controller/Service
Thay vì viết lại CRUD cho từng thực thể, bạn chỉ cần kế thừa `BaseController` và `BaseService`.

**1. Tạo Entity (`student.entity.ts`):**
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('students')
export class StudentEntity extends BaseEntity {
  @Column()
  name: string;
}
```

**2. Tạo Service (`student.service.ts`):**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { StudentEntity } from './student.entity';

@Injectable()
export class StudentService extends BaseService<StudentEntity> {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>,
  ) {
    super(repo);
  }
}
```

**3. Tạo Controller (`student.controller.ts`):**
```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../core/base/base.controller';
import { StudentEntity } from './student.entity';
import { StudentService } from './student.service';

@ApiTags('students')
@Controller('students')
export class StudentController extends BaseController<StudentEntity> {
  constructor(private readonly service: StudentService) {
    super(service);
  }
}
```
Khi chạy dự án, endpoint `/api/students/page`, `/api/students/all`, `/api/students/:id`, v.v. (bao gồm import/export) sẽ tự động có sẵn để Frontend gọi qua `useInitModel`.

## 🔐 Google Login
Tích hợp sẵn qua `@nestjs/passport` và `passport-google-oauth20`.
- **Luồng:** Người dùng truy cập `/api/auth/google` -> Đăng nhập trên popup Google -> Redirect về `/api/auth/google/callback` -> Backend xử lý, lưu user vào db và trả về JWT token redirect sang frontend.
