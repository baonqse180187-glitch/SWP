# 🔌 Hướng Dẫn Kết Nối Backend API

## 📋 Tổng Quan

Frontend React đã được cấu hình để kết nối với **Spring Boot Backend** qua Axios.

## ⚙️ Cấu Hình

### 1. Backend Configuration (application.properties)
```properties
# Server
server.port=8080
server.address=0.0.0.0

# Database
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=EVWarrantyHub
spring.datasource.username=sa
spring.datasource.password=12345

# Frontend URL
app.frontend.url=http://localhost:5173

# JWT
jwt.signerKey=P46G8qrdvgdhf5OxSCgbCukU0uZiqTSoYumC+YYYW9M6Gah02ISTnHfpS1zcDa0O

# Email (for forgot password)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=vuxtus1233@gmail.com
```

### 4. Axios Configuration
File `src/api/axios.js`:
```properties
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=EVWarrantyHub
```

### 3. Vite Dev Server (vite.config.js)
```javascript
server: {
  port: 5173,  // Match với app.frontend.url
  host: '0.0.0.0',
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```
- ✅ Base URL: `http://localhost:8080/api`
- ✅ Timeout: 30 giây
- ✅ Auto-inject Bearer Token vào mỗi request
- ✅ Auto-refresh token khi 401 Unauthorized
- ✅ Redirect đến `/login` khi token hết hạn

## 📡 API Endpoints Đã Mapping

### 🔐 Authentication (`/auth/*`)
```javascript
// Login với username + password (không phải email)
authAPI.login({ username, password })           // POST /auth/login

authAPI.logout()                                 // POST /auth/logout
authAPI.introspect(token)                        // POST /auth/introspect
authAPI.refreshToken(refreshToken)               // POST /auth/refresh
authAPI.getCurrentUser()                         // GET /users/myInfo
authAPI.forgotPassword(email)                    // POST /auth/forgot-password (dùng email để gửi link)
authAPI.resetPassword(token, newPassword)        // POST /auth/reset-password
```

### 👤 User Management (`/users/*`)
```javascript
userAPI.getUsers(params)                     // GET /users
userAPI.getUserById(id)                      // GET /users/{id}
userAPI.createUser(userData)                 // POST /users
userAPI.updateUser(id, userData)             // PUT /users/{id}
userAPI.deleteUser(id)                       // DELETE /users/{id}
userAPI.changePassword(userId, passwordData) // PUT /users/{userId}/change-password
```

### 👥 Customer Management (`/customers/*`)
```javascript
customerAPI.getCustomers(params)             // GET /customers
customerAPI.getCustomerById(id)              // GET /customers/{id}
customerAPI.createCustomer(data)             // POST /customers
customerAPI.updateCustomer(id, data)         // PUT /customers/{id}
customerAPI.deleteCustomer(id)               // DELETE /customers/{id}
customerAPI.searchCustomers(keyword)         // GET /customers/search
```

### 🚗 Vehicle Management (`/vehicles/*`)
```javascript
vehicleAPI.getVehicles(params)               // GET /vehicles
vehicleAPI.getVehicleById(id)                // GET /vehicles/{id}
vehicleAPI.getVehicleByVIN(vin)              // GET /vehicles/vin/{vin}
vehicleAPI.createVehicle(data)               // POST /vehicles
vehicleAPI.updateVehicle(id, data)           // PUT /vehicles/{id}
vehicleAPI.deleteVehicle(id)                 // DELETE /vehicles/{id}
vehicleAPI.getVehiclesByCustomer(customerId) // GET /vehicles/customer/{customerId}
```

### 📝 Warranty Claim Management (`/warranty-claims/*`)
```javascript
warrantyClaimAPI.getClaims(params)           // GET /warranty-claims
warrantyClaimAPI.getClaimById(id)            // GET /warranty-claims/{id}
warrantyClaimAPI.createClaim(data)           // POST /warranty-claims
warrantyClaimAPI.updateClaim(id, data)       // PUT /warranty-claims/{id}
warrantyClaimAPI.deleteClaim(id)             // DELETE /warranty-claims/{id}
warrantyClaimAPI.approveClaim(id, data)      // PUT /warranty-claims/{id}/approve
warrantyClaimAPI.rejectClaim(id, reason)     // PUT /warranty-claims/{id}/reject
warrantyClaimAPI.assignClaim(id, techId)     // PUT /warranty-claims/{id}/assign
warrantyClaimAPI.updateClaimStatus(id, status) // PUT /warranty-claims/{id}/status
warrantyClaimAPI.getClaimsByStatus(status)   // GET /warranty-claims/status
```

### 🏢 Service Center Management (`/service-centers/*`)
```javascript
serviceCenterAPI.getServiceCenters(params)   // GET /service-centers
serviceCenterAPI.getServiceCenterById(id)    // GET /service-centers/{id}
serviceCenterAPI.createServiceCenter(data)   // POST /service-centers
serviceCenterAPI.updateServiceCenter(id, data) // PUT /service-centers/{id}
serviceCenterAPI.deleteServiceCenter(id)     // DELETE /service-centers/{id}
```

### 🔧 Part Management (`/parts/*`)
```javascript
partAPI.getParts(params)                     // GET /parts
partAPI.getPartById(id)                      // GET /parts/{id}
partAPI.createPart(data)                     // POST /parts
partAPI.updatePart(id, data)                 // PUT /parts/{id}
partAPI.deletePart(id)                       // DELETE /parts/{id}
partAPI.getPartsByType(typeId)               // GET /parts/type/{typeId}
partAPI.searchParts(keyword)                 // GET /parts/search
```

### 📦 Part Type Management (`/part-types/*`)
```javascript
partTypeAPI.getPartTypes()                   // GET /part-types
partTypeAPI.getPartTypeById(id)              // GET /part-types/{id}
partTypeAPI.createPartType(data)             // POST /part-types
partTypeAPI.updatePartType(id, data)         // PUT /part-types/{id}
partTypeAPI.deletePartType(id)               // DELETE /part-types/{id}
```

### 🛠️ Installed Part Management (`/installed-parts/*`)
```javascript
installedPartAPI.getInstalledParts(params)   // GET /installed-parts
installedPartAPI.getInstalledPartById(id)    // GET /installed-parts/{id}
installedPartAPI.createInstalledPart(data)   // POST /installed-parts
installedPartAPI.updateInstalledPart(id, data) // PUT /installed-parts/{id}
installedPartAPI.deleteInstalledPart(id)     // DELETE /installed-parts/{id}
installedPartAPI.getInstalledPartsByVehicle(vehicleId) // GET /installed-parts/vehicle/{vehicleId}
```

### 📋 Service History Management (`/service-histories/*`)
```javascript
serviceHistoryAPI.getServiceHistories(params) // GET /service-histories
serviceHistoryAPI.getServiceHistoryById(id)  // GET /service-histories/{id}
serviceHistoryAPI.createServiceHistory(data) // POST /service-histories
serviceHistoryAPI.updateServiceHistory(id, data) // PUT /service-histories/{id}
serviceHistoryAPI.deleteServiceHistory(id)   // DELETE /service-histories/{id}
serviceHistoryAPI.getServiceHistoriesByVehicle(vehicleId) // GET /service-histories/vehicle/{vehicleId}
```

### 📦 Product Management (`/products/*`)
```javascript
productAPI.getProducts(params)               // GET /products
productAPI.getProductById(id)                // GET /products/{id}
productAPI.createProduct(data)               // POST /products
productAPI.updateProduct(id, data)           // PUT /products/{id}
productAPI.deleteProduct(id)                 // DELETE /products/{id}
productAPI.searchProducts(keyword)           // GET /products/search
```

### 📢 Campaign Management (`/campaigns/*`)
```javascript
campaignAPI.getCampaigns(params)             // GET /campaigns
campaignAPI.getCampaignById(id)              // GET /campaigns/{id}
campaignAPI.createCampaign(data)             // POST /campaigns
campaignAPI.updateCampaign(id, data)         // PUT /campaigns/{id}
campaignAPI.deleteCampaign(id)               // DELETE /campaigns/{id}
campaignAPI.getCampaignsByStatus(status)     // GET /campaigns/status
```

### 📅 Appointment Management (`/appointments/*`)
```javascript
appointmentAPI.getAppointments(params)       // GET /appointments
appointmentAPI.getAppointmentById(id)        // GET /appointments/{id}
appointmentAPI.createAppointment(data)       // POST /appointments
appointmentAPI.updateAppointment(id, data)   // PUT /appointments/{id}
appointmentAPI.deleteAppointment(id)         // DELETE /appointments/{id}
appointmentAPI.confirmAppointment(id)        // PUT /appointments/{id}/confirm
appointmentAPI.cancelAppointment(id, reason) // PUT /appointments/{id}/cancel
```

### 🔔 Notification Management (`/notifications/*`)
```javascript
notificationAPI.getNotifications(params)     // GET /notifications
notificationAPI.getNotificationById(id)      // GET /notifications/{id}
notificationAPI.markAsRead(id)               // PUT /notifications/{id}/read
notificationAPI.markAllAsRead()              // PUT /notifications/read-all
notificationAPI.deleteNotification(id)       // DELETE /notifications/{id}
```

### 📁 File Upload (`/files/*`)
```javascript
fileAPI.uploadFile(file, type)               // POST /files/upload
fileAPI.uploadMultipleFiles(files, type)     // POST /files/upload-multiple
fileAPI.deleteFile(fileId)                   // DELETE /files/{fileId}
fileAPI.getFile(fileId)                      // GET /files/{fileId}
```

### 📊 Dashboard & Reports (`/reports/*`)
```javascript
reportAPI.getDashboardStats()                // GET /reports/dashboard
reportAPI.getWarrantyClaimStats(params)      // GET /reports/warranty-claims
reportAPI.getServiceCenterStats(params)      // GET /reports/service-centers
reportAPI.getPartUsageStats(params)          // GET /reports/parts-usage
reportAPI.exportReport(reportType, params)   // GET /reports/export/{reportType}
```

## 🔑 Authentication Flow

### 1. Login
```javascript
import { authAPI } from '@/api'

// Login với username (không phải email)
const result = await authAPI.login({ 
  username: 'admin',   // Tên đăng nhập
  password: 'admin123' 
})
// Response: { user, accessToken, refreshToken }

// Token tự động được lưu vào localStorage và inject vào headers
```

### 2. Auto Token Refresh
```javascript
// Axios interceptor tự động xử lý:
// - Request có 401 → Gọi refreshToken
// - Refresh thành công → Retry request gốc
// - Refresh thất bại → Redirect /login
```

### 3. Logout
```javascript
await authAPI.logout()
// Tự động xóa token và redirect về /login
```

## 🎯 Backend Requirements

Backend Spring Boot cần implement các endpoint sau:

### Required Response Format

#### Login Response
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "user": {
      "id": "user-id",
      "username": "admin",  // Username để đăng nhập
      "email": "admin@example.com",
      "fullName": "System Administrator",
      "phone": "0123456789",
      "role": {
        "roleName": "ADMIN" | "EVM_STAFF" | "SC_STAFF" | "SC_TECHNICIAN",
        "description": "Quản trị viên hệ thống"
      }
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

#### Error Response
```json
{
  "code": 1001,
  "message": "Error message",
  "errors": ["detail 1", "detail 2"]
}
```

### Security Configuration
```java
// Spring Security cần cho phép:
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http
        .cors() // Enable CORS
        .and()
        .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        .and()
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    
    @Value("${app.frontend.url}") // http://localhost:5173
    private String frontendUrl;
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(frontendUrl) // Từ application.properties
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

## 🧪 Testing API

### 1. Start Backend Spring Boot
```bash
cd FA25_SWP391_SE1818_G6-main/EVWarrantyHub
mvnw.cmd spring-boot:run
# hoặc: ./mvnw spring-boot:run (Linux/Mac)
```

Backend chạy ở: **http://localhost:8080**
- Database: SQL Server (localhost:1433)
- JWT Authentication enabled
- Email service configured (Gmail SMTP)

### 2. Start Frontend
```bash
cd OEM
npm run dev
```

Frontend chạy ở: **http://localhost:5173** (match với backend config)
- Vite auto-reload on file changes
- Proxy requests to backend via /api
- Hot Module Replacement (HMR) enabled

### 3. Test Login
1. Mở browser: **http://localhost:5173**
2. Nhập email/password
3. Check Network tab → Xem request đến **http://localhost:8080/api/auth/login**
4. Check Console → Xem token được lưu vào localStorage

## 🐛 Troubleshooting

### CORS Error
**Lỗi**: `Access-Control-Allow-Origin`
**Giải pháp**: Thêm CORS config vào Spring Boot (xem phần CORS Configuration)

### 401 Unauthorized
**Lỗi**: Request bị reject với 401
**Giải pháp**: 
- Check token có được gửi trong header không
- Check token có hết hạn không
- Check Spring Security config

### Network Error
**Lỗi**: `Network Error` hoặc `ERR_CONNECTION_REFUSED`
**Giải pháp**:
- Check backend có đang chạy không
- Check port 8080 có available không
- Check firewall/antivirus có block không

## 📝 Notes

- ✅ Tất cả API endpoints đã được mapping theo backend structure
- ✅ Axios interceptor tự động xử lý authentication
- ✅ Token refresh tự động khi expired
- ✅ Error handling đầy đủ
- ✅ Support file upload với multipart/form-data
- ⚠️ Backend cần implement đúng response format
- ⚠️ Backend cần enable CORS cho frontend

## 🚀 Next Steps

1. ✅ Start backend Spring Boot
2. ✅ Start frontend React
3. ⏳ Test login flow
4. ⏳ Implement các trang CRUD theo role
5. ⏳ Test toàn bộ API endpoints
