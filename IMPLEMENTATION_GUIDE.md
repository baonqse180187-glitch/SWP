# 🚀 Full Stack Implementation - 4 Role Modules

## ✅ COMPLETED (Phase 1: SC Technician - 80%)

### Files Created:
1. ✅ **TechnicianDashboard.jsx** + CSS
   - 4 stat cards (Total, Pending, Approved, Completed)
   - Recent claims table with status badges
   - Quick action cards
   - Full API integration ready

2. ✅ **MyClaims.jsx** + CSS
   - Gmail-style claims list
   - 6 filter tabs (All, Pending, Approved, In Repair, Completed, Rejected)
   - Search by claim number, VIN, description
   - Responsive card layout

3. ✅ **CreateClaim.jsx** (Logic complete, CSS pending)
   - 4-step wizard: Vehicle → Parts → Description → Upload
   - VIN lookup with vehicle validation
   - Part type selection (7 types)
   - File upload (images, videos, PDF)
   - Full form validation

### Remaining:
- CreateClaim.module.css (styling for wizard)
- ClaimDetail.jsx + CSS (view/edit claim, timeline, progress update)

---

## 📋 TODO: Phase 2-4 (Remaining 27 files)

### EVM Staff Module (8 files):
```
src/pages/evm/
├── EVMDashboard.jsx + .module.css
├── ClaimApproval.jsx + .module.css (table with bulk actions)
├── ClaimReview.jsx + .module.css (approve/reject modal)
└── Inventory.jsx + .module.css (parts stock, alerts)
```

### SC Staff Module (8 files):
```
src/pages/sc/
├── SCDashboard.jsx + .module.css
├── VehicleManagement.jsx + .module.css (VIN lookup, customer link)
├── CampaignManagement.jsx + .module.css (campaign vehicles)
└── Appointments.jsx + .module.css (calendar view)
```

### Admin Module (6 files):
```
src/pages/admin/
├── CreateCampaign.jsx + .module.css (wizard: query → vehicles → SCs)
├── UserManagement.jsx + .module.css (CRUD table)
└── Analytics.jsx + .module.css (recharts: failure rates, costs)
```

### Routes & Navigation (5 files):
```
Update:
- src/App.jsx (add 15+ routes)
- src/components/layout/Sidebar.jsx (menu items)
- src/utils/constants.js (menu structure)
```

---

## 🎯 Quick Start Guide for Remaining Work

### Step 1: Complete CreateClaim CSS
Create `src/pages/technician/CreateClaim.module.css`:
- `.stepsIndicator` - horizontal wizard with circles
- `.formCard` - white card with shadow
- `.vinInput` - input + button combo
- `.uploadArea` - drag & drop zone
- `.fileList` - uploaded files with delete button

### Step 2: Build EVM Dashboard
Pattern similar to TechnicianDashboard:
- Stat cards: Pending Claims, Approved Today, Low Stock Alerts, Processing Time
- Claims table (pending only)
- Quick actions: Approve Claims, Manage Inventory, View Reports

### Step 3: Build ClaimApproval Page
Key features:
- Table with checkboxes for bulk selection
- Inline approve/reject buttons
- Modal for rejection reason
- Filters by date range, service center
- API: `claimAPI.approveClaim()`, `claimAPI.rejectClaim()`

### Step 4: Update App.jsx Routes
```jsx
// Add these routes
<Route path="/technician/*" element={<ProtectedRoute allowedRoles={[ROLES.SC_TECHNICIAN]}><TechnicianLayout /></ProtectedRoute>}>
  <Route index element={<TechnicianDashboard />} />
  <Route path="claims" element={<MyClaims />} />
  <Route path="claims/new" element={<CreateClaim />} />
  <Route path="claims/:id" element={<ClaimDetail />} />
</Route>

<Route path="/evm/*" element={<ProtectedRoute allowedRoles={[ROLES.EVM_STAFF]}><EVMLayout /></ProtectedRoute>}>
  <Route index element={<EVMDashboard />} />
  <Route path="claims" element={<ClaimApproval />} />
  <Route path="claims/:id" element={<ClaimReview />} />
  <Route path="inventory" element={<Inventory />} />
</Route>

// Similar for /sc/* and /admin/* routes
```

### Step 5: Update Sidebar Menu
```jsx
const menuByRole = {
  [ROLES.SC_TECHNICIAN]: [
    { path: '/technician', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/technician/claims', icon: FaClipboardList, label: 'Yêu cầu của tôi' },
    { path: '/technician/claims/new', icon: FaPlus, label: 'Tạo yêu cầu mới' }
  ],
  [ROLES.EVM_STAFF]: [
    { path: '/evm', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/evm/claims', icon: FaCheckCircle, label: 'Duyệt yêu cầu' },
    { path: '/evm/inventory', icon: FaBoxes, label: 'Quản lý kho' }
  ],
  // ... similar for SC_STAFF and ADMIN
};
```

---

## 💡 Component Patterns to Reuse

### 1. Status Badge Component
```jsx
// src/components/common/StatusBadge.jsx
export const StatusBadge = ({ status }) => {
  const config = {
    PENDING: { label: 'Chờ duyệt', color: 'warning', icon: FaClock },
    APPROVED: { label: 'Đã duyệt', color: 'success', icon: FaCheckCircle },
    // ...
  };
  // Return styled badge
};
```

### 2. Data Table Component
```jsx
// src/components/common/DataTable.jsx
export const DataTable = ({ columns, data, onRowClick, loading }) => {
  // Reusable table with sorting, pagination
};
```

### 3. Modal Component
```jsx
// src/components/common/Modal.jsx
export const Modal = ({ isOpen, onClose, title, children }) => {
  // Generic modal with overlay
};
```

---

## 🔥 API Integration Checklist

### Already Available in `src/api/index.js`:
- ✅ `claimAPI` - getClaims, createClaim, approveClaim, rejectClaim
- ✅ `vehicleAPI` - getVehicleByVIN, getVehicles
- ✅ `partsAPI` - getInventory, distributePartsToClaim
- ✅ `campaignAPI` - getCampaigns, updateCampaignVehicleStatus
- ✅ `userAPI` - getUsers, createUser, updateUser
- ✅ `reportAPI` - getDashboardStats, getFailureRateByModel

### Usage Pattern:
```javascript
useEffect(() => {
  fetchData();
}, [dependencies]);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await API.method(params);
    const data = response.data.result;
    setState(data);
  } catch (error) {
    console.error('Error:', error);
    // Fallback to mock data for development
    setState(mockData);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Progress Tracker

**Total Files to Create**: 32
**Completed**: 5 (16%)
**Remaining**: 27 (84%)

**Estimated Time**:
- Phase 1 (Technician): 2 files left = ~1 hour
- Phase 2 (EVM Staff): 8 files = ~3 hours
- Phase 3 (SC Staff): 8 files = ~3 hours
- Phase 4 (Admin): 6 files = ~2 hours
- Phase 5 (Routes): 3 files = ~30 min
**Total**: ~10 hours

---

## 🎨 Design System Summary

### Colors:
- Primary: `#14b8a6` (Teal)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Gray: `#6b7280` (Text), `#f3f4f6` (Background)

### Typography:
- Title: 28px, font-weight: 700
- Subtitle: 14px, color: #6b7280
- Body: 16px, line-height: 1.6

### Spacing:
- Container padding: 24px
- Card padding: 24px
- Gap between elements: 16px
- Section margin: 32px

### Shadows:
- Default: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: `0 4px 12px rgba(0,0,0,0.15)`

### Border Radius:
- Buttons: 8px
- Cards: 12px
- Badges: 20px (pill)

---

## 🚀 Next Steps

1. **Complete Technician Module** (CreateClaim CSS + ClaimDetail)
2. **Build EVM Module** (Dashboard → ClaimApproval → Inventory)
3. **Build SC Module** (Dashboard → VehicleManagement → Campaigns)
4. **Build Admin Module** (Campaign Creator → User Management → Analytics)
5. **Update Routes** (App.jsx + Sidebar.jsx)
6. **Testing** (Test all flows end-to-end)
7. **Polish** (Responsive, loading states, error handling)

---

**Start with**: `CreateClaim.module.css` (copy similar styles from MyClaims.module.css)
**Then build**: `ClaimDetail.jsx` (read-only view + edit mode + timeline)
**Reference**: TechnicianDashboard.jsx for structure, API integration pattern

---

**Last Updated**: 2025-01-20
**Status**: Phase 1 (Technician) 80% complete
**Next**: Complete Technician → EVM → SC → Admin
