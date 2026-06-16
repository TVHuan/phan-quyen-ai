# 📖 Hướng Dẫn Code Chuẩn Base (Frontend - UmiJS)

Tài liệu này cung cấp hướng dẫn toàn diện cho việc phát triển Frontend dựa trên kiến trúc **BaseWebV1**. Mục tiêu là đảm bảo tính đồng bộ, tái sử dụng tối đa các thành phần Base và tránh việc "code tay" những tính năng đã được hỗ trợ sẵn.

---

## 🏗 Cấu Trúc Mã Nguồn (Folder Structure)

Việc đặt file và cấu trúc thư mục đúng quy định là **bắt buộc** để giữ cho dự án gọn gàng và dễ bảo trì.

- `src/pages/[TenModule]`: Chứa các màn hình của hệ thống (VD: `pages/QuanLySinhVien`). Bên trong mỗi page chia thành:
  - `index.tsx`: Chứa component chính hiển thị `TableBase`.
  - `Form.tsx` hoặc thư mục `components/`: Chứa Form dùng để thêm/sửa hoặc các component con đặc thù của page.
- `src/models/`: Chứa các custom model hoặc model mở rộng (nếu cần thiết). Đa số các CRUD cơ bản sẽ dùng `useInitModel` dùng chung, không cần tạo model mới.
- `src/components/`: Nơi đặt các component dùng chung trên toàn hệ thống (không đặt component nghiệp vụ riêng lẻ ở đây).
- `src/services/`: Chứa định nghĩa endpoint gọi API, file `api.ts` và `typing.d.ts` cho các interface.
- `src/utils/`: Chứa các hàm hỗ trợ chung (format thời gian, tính toán, format tiền tệ...).

---

## 💻 Hướng Dẫn Code & Components Có Sẵn

Frontend Base cung cấp các component rất mạnh mẽ để build UI nhanh chóng, đồng bộ với backend base.

### 1. Các Component Hỗ Trợ Sẵn Nổi Bật

- **`TableBase`** (`@/components/Table`): 
  - Là "trái tim" của hệ thống quản lý. 
  - Hỗ trợ tự động: Phân trang (Pagination), Tìm kiếm (Global search + Column filter), Export/Import.
  - Tự động call API, tự quản lý state danh sách, hiển thị Loading, hiển thị Modal Form.
- **`PageCard`** (`@/components/PageCard`): Dùng làm layout vỏ ngoài bao bọc TableBase để tạo các khoảng trắng chuẩn chỉ và hỗ trợ back về trang trước.
- **`ModalExpandable`**: Modal có thể phóng to / thu nhỏ. Thường dùng để render nội dung Form thêm/sửa cho TableBase.
- **`PDFViewer` & `PDFViewerV2`**: Dùng để preview file PDF.
- **`PrintTemplate`**: Component hỗ trợ trong việc in ấn biểu mẫu.
- **`Upload`**: Component xử lý upload file đồng bộ giao diện chung.
- **`JsonEditor`**: Dùng để thao tác JSON dễ dàng nếu cần cấu hình động.

### 2. Cách Tạo Màn Hình CRUD Cực Nhanh

Không dùng `useState` hoặc `useEffect` để call API danh sách thủ công. Sử dụng combo `useModel` + `TableBase`.

**Bước 1: Khai báo Model (Nếu chưa có model API generic)**
Frontend base thường dùng hàm `useInitModel(endpoint)` để tạo động model call xuống backend.

**Bước 2: Xây dựng file `index.tsx` của màn hình:**
```tsx
import React from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import FormKhoa from './Form';

const QuanLyKhoa = () => {
  // Định nghĩa các cột cho Table
  const columns: IColumn<any>[] = [
    {
      title: 'Mã khoa',
      dataIndex: 'maKhoa',
      width: 150,
      filterType: 'string', // Sẽ hiển thị ô search string ở tiêu đề cột
    },
    {
      title: 'Tên khoa',
      dataIndex: 'tenKhoa',
      width: 250,
      filterType: 'string',
    },
  ];

  return (
    <TableBase
      title="Danh sách khoa"
      modelName="khoa" // Tên alias của model hoặc config hook (khớp với endpoint)
      columns={columns}
      Form={FormKhoa} // Tự động hiển thị Form Khoa khi bấm nút "Thêm mới" hoặc "Sửa"
      formType="Modal" // Chọn 'Modal' hoặc 'Drawer'
      widthDrawer={800} // Độ rộng của Modal
      buttons={{
        create: true,
        export: true,
        reload: true,
      }}
      rowSelection={true} // Bật tính năng chọn nhiều dòng
      deleteMany={true}   // Bật tính năng xóa nhiều
    />
  );
};

export default QuanLyKhoa;
```

**Bước 3: Xây dựng `Form.tsx`:**
`Form` được truyền vào `TableBase` sẽ nhận các props nội bộ.
```tsx
import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';

const FormKhoa = () => {
  const [form] = Form.useForm();
  // Lấy các state tự động từ model "khoa" do TableBase quản lý
  const { record, edit, setVisibleForm, postModel, putModel } = useModel('khoa' as any);

  useEffect(() => {
    if (edit && record) {
      form.setFieldsValue(record); // Load data lên form khi sửa
    } else {
      form.resetFields(); // Reset khi thêm mới
    }
  }, [record, edit]);

  const onFinish = async (values: any) => {
    try {
      if (edit) {
        await putModel(record?.id, values);
      } else {
        await postModel(values);
      }
      setVisibleForm(false); // Thành công thì đóng form
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Mã khoa" name="maKhoa" rules={[rules.required]}>
        <Input placeholder="Nhập mã khoa" />
      </Form.Item>
      <Form.Item label="Tên khoa" name="tenKhoa" rules={[rules.required]}>
        <Input placeholder="Nhập tên khoa" />
      </Form.Item>
      
      <div style={{ textAlign: 'right' }}>
        <Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">Lưu lại</Button>
      </div>
    </Form>
  );
};

export default FormKhoa;
```

---

## ⚖️ Quy Tắc Chung (Naming & Code Conventions)

1. **Naming Conventions:**
   - Đặt tên file component UI Frontend: Viết hoa chữ cái đầu (PascalCase), VD: `QuanLySinhVien.tsx`, `PageCard.tsx`.
   - Đặt tên file hooks, utils, services: Viết thường (camelCase), VD: `useInitModel.ts`, `formatDate.ts`.

2. **Styling:**
   - Chỉ dùng CSS file (hoặc LESS) cho component cụ thể khi thực sự cần thiết. Khuyến khích sử dụng inline styles để dễ kiểm soát hoặc Antd design token.
   - Các class LESS đặt tên theo định dạng kebab-case.

3. **Lưu ý khi mở rộng Base:**
   - Nếu bạn thấy 1 tính năng có thể dùng chung cho nhiều page (VD: Component chọn đơn vị hành chính), hãy viết nó ở `src/components` thay vì để kẹp trong thư mục của 1 page.
