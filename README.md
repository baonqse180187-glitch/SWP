# 🚗 EVWarrantyHub - Hệ Thống Quản Lý Bảo Hành Xe Điện

> **Full-stack application** quản lý bảo hành xe điện với **React + Spring Boot + SQL Server**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-purple.svg)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green.svg)](https://spring.io/projects/spring-boot)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-red.svg)](https://www.microsoft.com/sql-server)

## 📋 Tổng Quan

Hệ thống quản lý trung tâm bảo hành xe điện với **4 vai trò** và quyền hạn rõ ràng:

- 👨‍💼 **ADMIN** - Quản trị hệ thống, quản lý users, sản phẩm, báo cáo
- 👔 **EVM_STAFF** - Nhân viên hãng xe, phê duyệt bảo hành, quản lý sản phẩm/chiến dịch
- 🏢 **SC_STAFF** - Nhân viên trung tâm, tiếp nhận khách hàng, tạo yêu cầu bảo hành
- 🔧 **SC_TECHNICIAN** - Kỹ thuật viên, thực hiện sửa chữa, quản lý linh kiện

## 🎯 Tính Năng Chính

## 🎯 Tính Năng Chính

### 👨‍💼 Admin
- ✅ Quản lý users (CRUD, phân quyền)
- ✅ Quản lý sản phẩm (xe điện, phụ tùng)
- ✅ Xem báo cáo tổng hợp
- ✅ Cấu hình hệ thống

### 👔 EVM Staff (Nhân viên hãng)
- ✅ Phê duyệt/từ chối yêu cầu bảo hành
- ✅ Quản lý sản phẩm & chiến dịch
- ✅ Theo dõi warranty claims
- ✅ Quản lý phụ tùng thay thế

### 🏢 SC Staff (Nhân viên trung tâm)
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

### 🔧 SC Technician (Kỹ thuật viên)
- ✅ Xem phiếu bảo hành được giao
- ✅ Cập nhật tiến độ sửa chữa
- ✅ Quản lý linh kiện sử dụng
- ✅ Upload hình ảnh/báo cáo

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite 4
- **Routing**: React Router v6
- **HTTP Client**: Axios (với interceptors)
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Backend
- **Framework**: Spring Boot 3
- **Security**: Spring Security + JWT
- **Database**: SQL Server 2019+
- **ORM**: Hibernate/JPA
- **Email**: JavaMailSender (Gmail SMTP)

## 📦 Quick Start

### Prerequisites
- Java JDK 17+
- Node.js 18+
- SQL Server (hoặc SQL Server Express)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd OEM
```

### 2. Setup Database
```sql
CREATE DATABASE EVWarrantyHub;
```

### 3. Start Backend
```bash
cd FA25_SWP391_SE1818_G6-main/EVWarrantyHub
mvnw.cmd spring-boot:run
```

Backend: **http://localhost:8080/api**

### 4. Start Frontend
```bash
cd OEM
npm install
npm run dev
```

Frontend: **http://localhost:5173**

### 5. Login
- Mở browser: http://localhost:5173
- Nhập credentials:
  - **Username**: `admin` (hoặc test user khác)
  - **Password**: `admin123`
- Hệ thống sẽ tự động redirect theo role

## 📚 Documentation

- 📖 [**SETUP_GUIDE.md**](./SETUP_GUIDE.md) - Hướng dẫn cài đặt chi tiết từ đầu
- 🔌 [**API_CONNECTION_GUIDE.md**](./API_CONNECTION_GUIDE.md) - API endpoints và authentication
- 🗺️ [**PROJECT_REBUILD_ROADMAP.md**](./PROJECT_REBUILD_ROADMAP.md) - Roadmap phát triển đầy đủ

## 🗂️ Project Structure

```
OEM/
├── src/
│   ├── api/                  # API configuration & services
│   │   ├── axios.js         # Axios instance với interceptors
│   │   └── index.js         # Tất cả API endpoints
│   ├── components/
│   │   ├── common/          # Reusable components (Button, Input, Loading)
│   │   └── layout/          # Layout components (Sidebar, Header)
│   ├── contexts/            # React Context (AuthContext)
│   ├── pages/
│   │   ├── auth/            # Login, ForgotPassword
│   │   ├── admin/           # Admin pages
│   │   ├── evm/             # EVM Staff pages
│   │   ├── sc-staff/        # SC Staff pages
│   │   └── technician/      # Technician pages
│   ├── utils/               # Utilities & constants
│   └── App.jsx              # Main app với routing
├── .env                     # Environment variables
└── vite.config.js          # Vite configuration
```

## 🔑 Authentication

### JWT Token Flow
1. User login với username/password → Backend verify
2. Backend trả về `accessToken` + `refreshToken`
3. Frontend lưu token vào localStorage
4. Mọi request tự động inject: `Authorization: Bearer <token>`
5. Token expired → Auto refresh
6. Refresh failed → Redirect /login

### Role-Based Access Control
```javascript
// Protect routes by role
<ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
  <AdminDashboard />
</ProtectedRoute>

// Check permission
const { hasPermission } = useAuth()
if (hasPermission('CREATE_USER')) {
  // Show create button
}
```

## 🔧 Development

### Frontend Dev Server
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Dev Server
```bash
mvnw.cmd spring-boot:run           # Start backend
mvnw.cmd clean install             # Build project
mvnw.cmd test                      # Run tests
```

## 🌐 API Endpoints

**Base URL**: `http://localhost:8080/api`

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Reset mật khẩu

### Users
- `GET /users` - List users (Admin)
- `POST /users` - Create user (Admin)
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (Admin)

### Warranty Claims
- `GET /warranty-claims` - List claims
- `POST /warranty-claims` - Create claim
- `PUT /warranty-claims/{id}/approve` - Approve (EVM)
- `PUT /warranty-claims/{id}/assign` - Assign technician (SC Staff)

*Xem đầy đủ trong [API_CONNECTION_GUIDE.md](./API_CONNECTION_GUIDE.md)*

## 🎨 UI Components

### Common Components
- `Button` - 6 variants (primary, secondary, success, danger, warning, outline)
- `Input` - Form input with label, error, icon
- `Loading` - Spinner với fullScreen mode
- `ProtectedRoute` - Route protection theo role

### Layout Components
- `Sidebar` - Navigation menu theo role
- `Header` - User dropdown (profile, change password, logout, admin menu)
- `MainLayout` - Sidebar + Header wrapper

## 🔐 Environment Variables

File `.env`:
```properties
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=EVWarrantyHub
VITE_APP_VERSION=1.0.0
```

File `application.properties` (Backend):
```properties
server.port=8080
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=EVWarrantyHub
jwt.signerKey=<your-secret-key>
app.frontend.url=http://localhost:5173
```

## 🐛 Troubleshooting

### CORS Error
Thêm CORS config trong Spring Boot:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("*")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Database Connection Failed
1. Check SQL Server service đang chạy
2. Enable TCP/IP trong SQL Server Configuration Manager
3. Verify connection string trong `application.properties`

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## 📝 TODO List

### Phase 1: Foundation ✅
- [x] Setup project structure
- [x] Configure Axios & API services
- [x] Create AuthContext
- [x] Create common components
- [x] Create auth pages & layout
- [x] Setup routing with role protection

### Phase 2: Admin Features ⏳
- [ ] User management CRUD
- [ ] Product management CRUD
- [ ] Dashboard with statistics
- [ ] Report generation

### Phase 3: SC Staff Features ⏳
- [ ] Customer search & management
- [ ] Vehicle information (VIN lookup)
- [ ] Create warranty claims
- [ ] Assign technicians

### Phase 4: EVM Staff Features ⏳
- [ ] Approve/reject warranty claims
- [ ] Product & campaign management
- [ ] Parts inventory

### Phase 5: Technician Features ⏳
- [ ] View assigned claims
- [ ] Update repair status
- [ ] Upload photos/reports
- [ ] Parts usage tracking

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Team**: Spring Boot + SQL Server
- **Frontend Team**: React + Vite + Tailwind

## 📞 Support

Nếu gặp vấn đề:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section
2. Check [API_CONNECTION_GUIDE.md](./API_CONNECTION_GUIDE.md)
3. Open an issue trên GitHub

---

**Made with ❤️ by SWP391 Team**
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

Hệ thống hỗ trợ 4 loại người dùng:

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