# OEM - Trung tâm Bảo hành Xe điện

Hệ thống quản lý trung tâm bảo hành xe điện OEM với đầy đủ các tính năng cho nhân viên và kỹ thuật viên.

## 🚀 Tính năng chính

### Cho SC Staff (Nhân viên trung tâm):
- ✅ **Quản lý hồ sơ xe & khách hàng**
  - Tra cứu khách hàng theo VIN/Tên/SĐT
  - Xem thông tin chi tiết xe và khách hàng
  - Quản lý phụ tùng trên xe
  - Lịch sử dịch vụ & bảo hành
  - Ghi chú nội bộ

- ✅ **Phân công bảo hành**
  - Quản lý danh sách yêu cầu bảo hành
  - Phân công kỹ thuật viên xử lý
  - Theo dõi tiến độ và hiệu suất
  - Quản lý khối lượng công việc

### Cho SC Technician (Kỹ thuật viên):
- ✅ **Tạo yêu cầu bảo hành**
  - Tra cứu hồ sơ xe theo VIN
  - Tạo yêu cầu bảo hành chi tiết
  - Đính kèm báo cáo và hình ảnh
  - Gửi yêu cầu lên hãng

- ✅ **Thực hiện bảo hành**
  - Nhận phụ tùng từ hãng
  - Quản lý tiến độ sửa chữa
  - Cập nhật kết quả bảo hành
  - Bàn giao xe cho khách hàng

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **HTTP Client**: fetch
- **Form Handling**: React Hook Form
- **Icons**: Custom SVG Components
- **Charts**: Recharts (tùy chọn)

## 📦 Cài đặt

### 1. Clone dự án
```bash
git clone <repository-url>
cd OEM
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment
Tạo file `.env` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=OEM Warranty Center
VITE_APP_VERSION=1.0.0
```

### 4. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 🔧 Scripts available

```bash
# Development
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── Icons/          # Custom icon components
│   └── Layout/         # Layout components (Sidebar, Header)
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── CustomerManagement.jsx
│   ├── WarrantyRequest.jsx
│   ├── WarrantyAssignment.jsx
│   └── WarrantyExecution.jsx
├── services/           # API services
│   └── api.js         # API configuration và endpoints
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🔐 Authentication & Authorization

Hệ thống hỗ trợ 3 loại người dùng:

1. **SC_STAFF** (Nhân viên trung tâm)
   - Quản lý khách hàng
   - Phân công bảo hành

2.  **EVM_STAFF** (Nhân viên hãng)
   - Quản lý xác nhận đơn
   - Quản lý phân công bảo hành

3. **SC_TECHNICIAN** (Kỹ thuật viên)
   - Tạo yêu cầu bảo hành
   - Thực hiện bảo hành

4. **ADMIN** (Quản trị viên)
   - Toàn bộ quyền hạn
   - Tạo account cho nhân viên

### Demo Accounts:
- **Staff**:
- **Technician**: 
- **Admin**: 

## 🔌 API Integration

Frontend được thiết kế để kết nối với backend tại `http://localhost:8080`. 

### Cấu trúc API endpoints:
```
            "/api/auth/login",
            "/api/auth/introspect",
            "/api/users/forgot-password",
            "/api/users/verify-otp",
            "/api/users/reset-password",
            "/api/service-centers",
            "/api/service-centers/search"
```

### Build cho production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

Files build sẽ được tạo trong thư mục `dist/`.

## 📄 Business Rules

1. **BR-01**: Không tạo mới khách hàng - dữ liệu đồng bộ từ hãng
2. **BR-02**: VIN phải duy nhất trong hệ thống  
3. **BR-03**: Mỗi phụ tùng chỉ gắn trên một xe
4. **BR-04**: Phụ tùng bắt buộc phải có trước khi tạo bảo hành
5. **BR-05**: Chỉ ghi lịch sử cho VIN hợp lệ
6. **BR-06**: Ghi chú nội bộ ≤ 500 ký tự
7. **BR-07**: Dữ liệu đồng bộ từ hệ thống hãng
8. **BR-08**: Ghi log mọi thao tác quan trọng

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

**OEM Warranty Center** - Hệ thống quản lý bảo hành xe điện chuyên nghiệp