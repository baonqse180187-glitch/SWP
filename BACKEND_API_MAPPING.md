# Backend Database Schema - Mapping to Frontend

## ✅ Tables hiện có trong Backend

### 1. **Core Tables**
- `users` - Người dùng (Admin, EVM Staff, SC Staff, Technician)
- `roles` - Vai trò người dùng
- `part_type` - Loại phụ tùng (Battery, Motor, BMS, etc.)
- `part_brand` - Thương hiệu phụ tùng
- `product_model` - Model sản phẩm (xe)
- `warranty_policy` - Chính sách bảo hành

### 2. **Vehicle Management**
- `vehicles` - Thông tin xe (VIN, model, màu sắc, ngày bảo hành)
- `warranty_cards` - Thẻ bảo hành của xe
- `part_inventory` - Kho phụ tùng
- `part_distribution` - Phân phối phụ tùng cho service center

### 3. **Service Center**
- `service_centers` - Trung tâm dịch vụ
- `appointment` - Lịch hẹn
- `service_history` - Lịch sử dịch vụ

### 4. **Warranty Claims**
- `warranty_claims` - Yêu cầu bảo hành
- `claim_assignment` - Phân công claim cho technician
- `claim_attachment` - File đính kèm

### 5. **Campaigns**
- `recall_campaign` - Chiến dịch recall
- `campaign_vehicles` - Xe thuộc chiến dịch

### 6. **Password Reset**
- `password_reset_token` - Token reset mật khẩu

## 🔗 Relationships (Từ ERD)

```
users ─── roles
users ─── service_centers (SC Staff/Technician)
users ─── warranty_claims (creator/approver)
users ─── claim_assignment (technician)

vehicles ─── product_model
vehicles ─── warranty_cards
vehicles ─── warranty_claims
vehicles ─── service_history
vehicles ─── campaign_vehicles

warranty_claims ─── vehicles
warranty_claims ─── service_centers
warranty_claims ─── users (creator/approver)
warranty_claims ─── claim_assignment
warranty_claims ─── claim_attachment

service_centers ─── users
service_centers ─── warranty_claims
service_centers ─── part_distribution
service_centers ─── appointment

part_inventory ─── part_type
part_inventory ─── part_brand
part_distribution ─── service_centers

recall_campaign ─── campaign_vehicles
campaign_vehicles ─── vehicles
```

## 📋 Frontend API Integration

### Authentication APIs
```javascript
// src/api/index.js
export const authAPI = {
  login: (credentials) => POST('/auth/login'),
  logout: () => POST('/auth/logout'),
  getCurrentUser: () => GET('/users/myInfo'),
  forgotPassword: (email) => POST('/users/forgot-password'),
  resetPassword: (data) => POST('/users/reset-password')
}
```

### User Management (Admin)
```javascript
export const userAPI = {
  getUsers: (params) => GET('/users', { params }),
  getUserById: (id) => GET(`/users/${id}`),
  createUser: (userData) => POST('/users/register', userData),
  updateUser: (id, userData) => PUT(`/users/${id}`, userData),
  deleteUser: (id) => DELETE(`/users/${id}`)
}
```

### Vehicle Management
```javascript
export const vehicleAPI = {
  // Tra cứu xe theo VIN
  getVehicleByVIN: (vin) => GET(`/vehicles/vin/${vin}`),
  
  // Danh sách xe
  getVehicles: (params) => GET('/vehicles', { params }),
  
  // Chi tiết xe
  getVehicleById: (id) => GET(`/vehicles/${id}`),
  
  // Lịch sử bảo hành của xe
  getVehicleWarrantyHistory: (id) => GET(`/vehicles/${id}/warranty-history`),
  
  // Lịch sử dịch vụ
  getVehicleServiceHistory: (id) => GET(`/vehicles/${id}/service-history`),
  
  // Liên kết xe với khách hàng tại SC
  linkVehicleToCustomer: (data) => POST('/vehicles/link-customer', data)
}
```

### Warranty Claim Management
```javascript
export const claimAPI = {
  // Technician tạo claim mới
  createClaim: (claimData) => POST('/warranty-claims', claimData),
  
  // Lấy danh sách claims (có filter theo role)
  getClaims: (params) => GET('/warranty-claims', { params }),
  // params: { status, serviceCenter, technician, dateFrom, dateTo }
  
  // Chi tiết claim
  getClaimById: (id) => GET(`/warranty-claims/${id}`),
  
  // Technician cập nhật claim (khi còn PENDING)
  updateClaim: (id, data) => PUT(`/warranty-claims/${id}`, data),
  
  // EVM Staff duyệt/từ chối claim
  approveClaim: (id, data) => POST(`/warranty-claims/${id}/approve`, data),
  rejectClaim: (id, reason) => POST(`/warranty-claims/${id}/reject`, { reason }),
  
  // Technician cập nhật tiến độ sửa chữa
  updateClaimProgress: (id, status) => PUT(`/warranty-claims/${id}/progress`, { status }),
  // status: WAITING_PARTS, PARTS_RECEIVED, IN_REPAIR, COMPLETED
  
  // Upload attachment
  uploadAttachment: (claimId, file) => POST(`/warranty-claims/${claimId}/attachments`, file, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete attachment
  deleteAttachment: (claimId, attachmentId) => DELETE(`/warranty-claims/${claimId}/attachments/${attachmentId}`)
}
```

### Campaign/Recall Management
```javascript
export const campaignAPI = {
  // Admin tạo campaign
  createCampaign: (data) => POST('/campaigns', data),
  
  // Danh sách campaigns
  getCampaigns: (params) => GET('/campaigns', { params }),
  
  // Chi tiết campaign
  getCampaignById: (id) => GET(`/campaigns/${id}`),
  
  // Danh sách xe thuộc campaign
  getCampaignVehicles: (id, params) => GET(`/campaigns/${id}/vehicles`, { params }),
  
  // SC Staff cập nhật trạng thái xe trong campaign
  updateCampaignVehicleStatus: (campaignId, vehicleId, data) => 
    PUT(`/campaigns/${campaignId}/vehicles/${vehicleId}`, data),
  // data: { status, contactDate, appointmentDate, notes }
  
  // Báo cáo campaign
  getCampaignReport: (id) => GET(`/campaigns/${id}/report`)
}
```

### Parts Inventory
```javascript
export const partsAPI = {
  // Danh sách phụ tùng trong kho
  getInventory: (params) => GET('/inventory', { params }),
  
  // Chi tiết phụ tùng
  getPartById: (id) => GET(`/inventory/${id}`),
  
  // EVM: Xuất phụ tùng cho claim đã duyệt
  distributePartsToClaim: (claimId, data) => POST(`/inventory/distribute/${claimId}`, data),
  
  // Lịch sử giao dịch kho
  getInventoryTransactions: (params) => GET('/inventory/transactions', { params }),
  
  // Cảnh báo tồn kho thấp
  getLowStockAlerts: () => GET('/inventory/low-stock-alerts')
}
```

### Service Center Management
```javascript
export const serviceCenterAPI = {
  // Danh sách service centers
  getServiceCenters: (params) => GET('/service-centers', { params }),
  
  // Chi tiết service center
  getServiceCenterById: (id) => GET(`/service-centers/${id}`),
  
  // Tạo/cập nhật service center (Admin only)
  createServiceCenter: (data) => POST('/service-centers', data),
  updateServiceCenter: (id, data) => PUT(`/service-centers/${id}`, data),
  
  // Hiệu suất của service center
  getServiceCenterPerformance: (id, params) => GET(`/service-centers/${id}/performance`, { params })
}
```

### Appointment Management
```javascript
export const appointmentAPI = {
  // SC Staff tạo lịch hẹn
  createAppointment: (data) => POST('/appointments', data),
  
  // Danh sách lịch hẹn
  getAppointments: (params) => GET('/appointments', { params }),
  
  // Cập nhật lịch hẹn
  updateAppointment: (id, data) => PUT(`/appointments/${id}`, data),
  
  // Hủy lịch hẹn
  cancelAppointment: (id, reason) => DELETE(`/appointments/${id}`, { data: { reason } })
}
```

### Reports & Analytics (Admin/EVM Staff)
```javascript
export const reportAPI = {
  // Dashboard statistics
  getDashboardStats: (params) => GET('/reports/dashboard', { params }),
  // params: { dateFrom, dateTo, serviceCenter, model }
  
  // Tỷ lệ hỏng hóc theo model
  getFailureRateByModel: (params) => GET('/reports/failure-rate/model', { params }),
  
  // Tỷ lệ hỏng hóc theo loại phụ tùng
  getFailureRateByPart: (params) => GET('/reports/failure-rate/part', { params }),
  
  // Chi phí bảo hành
  getWarrantyCosts: (params) => GET('/reports/warranty-costs', { params }),
  
  // Hiệu suất technician
  getTechnicianPerformance: (params) => GET('/reports/technician-performance', { params })
}
```

## 🎯 Frontend Components to Build

### Phase 3: SC Technician Interface
1. **Warranty Claim Form** (`/sc/claims/new`)
   - Chọn xe (VIN lookup)
   - Chọn phụ tùng bị lỗi
   - Upload ảnh/video
   - Mô tả lỗi

2. **My Claims Dashboard** (`/sc/claims`)
   - Table với filter: All, Pending, Approved, Rejected, Completed
   - Search, pagination
   - Click vào claim để xem chi tiết

3. **Claim Detail Page** (`/sc/claims/:id`)
   - Xem thông tin đầy đủ
   - Cập nhật tiến độ (nếu APPROVED)
   - Upload thêm attachment
   - History timeline

### Phase 4: SC Staff Interface
1. **Vehicle Search & Link** (`/sc/vehicles`)
   - Tra cứu VIN
   - Liên kết với khách hàng
   - Xem lịch sử

2. **Campaign Management** (`/sc/campaigns`)
   - Danh sách campaigns nhận được
   - Danh sách xe cần xử lý
   - Cập nhật trạng thái từng xe
   - Đặt lịch hẹn

3. **Appointment Calendar** (`/sc/appointments`)
   - Calendar view
   - Tạo/sửa lịch hẹn
   - Assign technician

4. **Team Management** (`/sc/team`)
   - Danh sách technicians
   - Phân công công việc
   - Xem hiệu suất

### Phase 5: EVM Staff Interface
1. **Claim Approval Queue** (`/evm/claims`)
   - Pending claims table
   - Quick approve/reject
   - Bulk actions

2. **Claim Detail Review** (`/evm/claims/:id`)
   - Xem đầy đủ thông tin
   - Xem attachments
   - Approve/Reject với ghi chú
   - Auto trigger parts distribution

3. **Parts Inventory** (`/evm/inventory`)
   - Stock levels
   - Low stock alerts
   - Distribution history
   - Manual adjust stock

4. **Claims Analytics** (`/evm/analytics`)
   - Claims by status
   - Processing time
   - Cost analysis
   - Failure rate trends

### Phase 6: Admin Interface
1. **Campaign Creator** (`/admin/campaigns/new`)
   - Campaign details form
   - VIN query builder
   - Auto-generate affected vehicles list
   - Distribute to service centers

2. **System Reports** (`/admin/reports`)
   - Overall dashboard
   - Failure rate charts
   - Cost breakdown
   - Service center comparison

3. **User Management** (`/admin/users`)
   - CRUD users
   - Role assignment
   - Service center assignment

4. **System Settings** (`/admin/settings`)
   - Warranty policies
   - Product models
   - Part types
   - Email templates

## 📊 Status Enums (Frontend Constants)

```javascript
// src/utils/constants.js

export const CLAIM_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED', 
  REJECTED: 'REJECTED',
  WAITING_PARTS: 'WAITING_PARTS',
  PARTS_RECEIVED: 'PARTS_RECEIVED',
  IN_REPAIR: 'IN_REPAIR',
  COMPLETED: 'COMPLETED'
}

export const CAMPAIGN_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const CAMPAIGN_VEHICLE_STATUS = {
  PENDING_CONTACT: 'PENDING_CONTACT',
  CONTACTED: 'CONTACTED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CUSTOMER_DECLINED: 'CUSTOMER_DECLINED'
}

export const PART_TYPES = {
  BATTERY: 'BATTERY',
  MOTOR: 'MOTOR',
  BMS: 'BMS',
  INVERTER: 'INVERTER',
  CHARGER: 'CHARGER',
  CONTROLLER: 'CONTROLLER',
  OTHER: 'OTHER'
}
```

## 🔥 Next Steps

1. ✅ **Backend connection** - Đã hoàn thành
2. ✅ **Authentication** - Đã hoàn thành
3. ✅ **Admin Dashboard** - Đã hoàn thành
4. 🚧 **SC Technician pages** - Cần build
5. 🚧 **SC Staff pages** - Cần build
6. 🚧 **EVM Staff pages** - Cần build
7. 🚧 **Admin CRUD pages** - Cần build

Bạn muốn bắt đầu build từ module nào trước?
- **SC Technician** (Claims management)?
- **EVM Staff** (Approval workflow)?
- **Admin** (User management)?
