# 🚀 Quick Start Guide - Admin & EVM-Staff Features

## 📦 Đã cài đặt

Tất cả các component và chức năng cho **Admin** và **EVM-Staff** đã được code hoàn chỉnh!

## 🔧 Cài đặt Dependencies (nếu chưa có)

```bash
npm install recharts
# hoặc
yarn add recharts
```

## 📂 Files đã tạo mới

### Admin Pages:
- ✅ `src/pages/admin/ProductManagement.jsx`
- ✅ `src/pages/admin/ProductManagement.module.css`
- ✅ `src/pages/admin/WarrantyApproval.jsx`
- ✅ `src/pages/admin/WarrantyApproval.module.css`

### EVM-Staff Pages:
- ✅ `src/pages/evm-staff/EVMDashboard.jsx` (đã cập nhật)
- ✅ `src/pages/evm-staff/EVMDashboard.module.css`
- ✅ `src/pages/evm-staff/CampaignManagement.jsx`
- ✅ `src/pages/evm-staff/CampaignManagement.module.css`

### Configuration:
- ✅ `src/App.jsx` (đã cập nhật routes)
- ✅ `src/components/Layout/navigationConfig.js` (đã cập nhật sidebar)

## 🎯 Routes đã thêm

### Admin Routes:
```
/admin/dashboard          → Dashboard tổng quan
/admin/users              → Quản lý users (đã có)
/admin/products           → Quản lý xe & phụ tùng (MỚI)
/admin/warranty-approval  → Phê duyệt bảo hành (MỚI)
/admin/analytics          → Báo cáo (đã có)
```

### EVM-Staff Routes:
```
/evm/dashboard          → Dashboard EVM (MỚI)
/evm/warranty-approval  → Phê duyệt bảo hành (MỚI)
/evm/products           → Quản lý sản phẩm (MỚI)
/evm/campaigns          → Quản lý chiến dịch (MỚI)
```

## 🧪 Test các chức năng

### 1. Admin Testing:
```javascript
// Login với admin credentials
// Sau đó truy cập:
http://localhost:5173/admin/dashboard
http://localhost:5173/admin/users
http://localhost:5173/admin/products
http://localhost:5173/admin/warranty-approval
http://localhost:5173/admin/analytics
```

### 2. EVM-Staff Testing:
```javascript
// Login với EVM staff credentials
// Sau đó truy cập:
http://localhost:5173/evm/dashboard
http://localhost:5173/evm/warranty-approval
http://localhost:5173/evm/products
http://localhost:5173/evm/campaigns
```

## ✨ Tính năng chính

### Admin có thể:
- ✅ Quản lý users (CRUD, phân quyền)
- ✅ Quản lý xe điện (thêm/sửa/xóa)
- ✅ Quản lý phụ tùng (thêm/sửa/xóa)
- ✅ Phê duyệt/từ chối warranty claims
- ✅ Xem báo cáo & analytics
- ✅ Theo dõi statistics real-time

### EVM-Staff có thể:
- ✅ Phê duyệt/từ chối warranty claims
- ✅ Quản lý sản phẩm (xe & phụ tùng)
- ✅ Quản lý campaigns
- ✅ Theo dõi claim trends
- ✅ Quản lý inventory phụ tùng
- ✅ Xem dashboard với metrics

## 🎨 UI Components

Tất cả pages đều có:
- 🔍 Search functionality
- 🎚️ Filter options
- 📊 Data visualization (charts)
- 📝 CRUD operations
- ⚡ Loading states
- ❌ Error handling
- ✅ Success notifications
- 📱 Responsive design

## 🔐 Authentication & Authorization

- ✅ Protected routes theo role
- ✅ Admin-only features
- ✅ EVM-Staff-only features
- ✅ Shared features (warranty approval, products)

## 📊 Data Flow

```
User Action → Component → API Call → Backend → Response → Update UI
```

Mock data được sử dụng khi API không available.

## 🐛 Debugging

Nếu gặp lỗi:

1. **Check console** để xem error messages
2. **Verify API endpoints** trong `src/api/index.js`
3. **Check role permissions** trong AuthContext
4. **Verify routes** trong `src/App.jsx`

## 📝 Notes

- Tất cả forms đều có validation
- Modals sử dụng ConfirmModal component
- CSS Modules được dùng cho styling
- Mock data có sẵn nếu API fails
- Icons từ react-icons
- Charts từ recharts

## 🎉 Ready to Use!

Tất cả chức năng đã sẵn sàng để test và sử dụng. Bạn có thể:

1. Run dev server: `npm run dev`
2. Login với admin/EVM credentials
3. Test tất cả các chức năng
4. Customize theo nhu cầu

---

📚 Xem thêm chi tiết trong `ADMIN_EVM_COMPLETE.md`
