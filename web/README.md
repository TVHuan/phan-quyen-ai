# AI Mô Phỏng - Frontend (UmiJS)

Đây là Frontend Base Code thuần chủng dành riêng cho hệ thống **AI Mô Phỏng**, được "tẩy rửa" và tối ưu hóa tối đa, loại bỏ hoàn toàn các cấu trúc thừa thãi từ kiến trúc Multi-tenant (đa phân hệ) cũ. Hệ thống sử dụng [UmiJS](https://umijs.org/) (React 19) kết hợp thư viện UI [Ant Design v5](https://ant.design/).

## 🌟 Đặc điểm nổi bật

- **Kiến trúc độc lập (Stand-alone Base)**: Giao diện sạch sẽ, loại bỏ nút chuyển phân hệ, module switcher, không dính dáng đến cấu trúc chia nhánh (QLDT, TCNS...) của trường học.
- **Quản lý linh hoạt**: Chỉ giữ lại 1 định danh `EModuleKey.BASE`, giúp toàn bộ hệ thống cực kỳ dễ đọc.
- **Tích hợp OneSignal thuần**: Xử lý trực tiếp Push Notification trên domain hiện tại (dùng token từ localStorage), không sử dụng iframe ẩn chéo site.
- **Mở rộng dễ dàng**: Các tính năng Layout, Header, AvatarDropdown đã được tinh giản, dọn đường sẵn để tích hợp Google Login.

## 📦 Yêu cầu hệ thống

- Node.js (Version >= 18)
- **Yarn** (Bắt buộc dùng `yarn` để quản lý package)

## 🛠️ Cài đặt & Chạy dự án

```bash
# 1. Cài đặt các gói phụ thuộc (Chỉ dùng yarn)
yarn install

# 2. Khởi chạy ở chế độ Development (Có Hot-reload)
yarn start

# 3. Build mã nguồn tĩnh để Deploy
yarn build
```

## 🗄️ Cấu trúc thư mục lõi

```text
web/
├── src/
│   ├── components/     # UI Components chung (Header, Footer, OneSignal)
│   ├── hooks/          # Custom Hooks (useInitModel kết nối API)
│   ├── models/         # Quản lý State (Dva/Umi Models)
│   ├── pages/          # Các màn hình chính
│   ├── services/       # File API, Type, constant.ts (Chứa EModuleKey.BASE)
│   ├── utils/          # Các hàm tiện ích (ip.ts, axios.ts)
│   └── app.tsx         # File khởi tạo gốc của ứng dụng
```

## 🔗 Liên kết với Backend

Hệ thống Frontend đã được thiết kế đồng bộ cực độ với Backend. Thông qua hook `useInitModel`, khi bạn gọi đến API `/user` hoặc `/setting`, toàn bộ tính năng **Import Excel, Export Excel, Get Template** đều tương thích 100% với BaseController bên phía NestJS.
