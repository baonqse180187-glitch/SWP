# EV Warranty Hub - Database Schema

## Core Tables

### 1. Users & Authentication
```sql
users (
  user_id INT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(100),
  role_id INT FK → roles,
  service_center_id INT FK → service_centers (NULL for EVM staff),
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

roles (
  role_id INT PRIMARY KEY,
  role_name VARCHAR(50), -- ADMIN, EVM_STAFF, SC_STAFF, SC_TECHNICIAN
  description TEXT
)
```

### 2. Vehicles & Products
```sql
vehicles (
  vehicle_id INT PRIMARY KEY,
  vin VARCHAR(17) UNIQUE NOT NULL, -- Vehicle Identification Number
  model_name VARCHAR(100),
  model_year INT,
  manufacturing_date DATE,
  color VARCHAR(50),
  warranty_start_date DATE,
  warranty_end_date DATE,
  current_mileage INT,
  status VARCHAR(20), -- ACTIVE, RECALLED, SCRAPPED
  created_at TIMESTAMP
)

vehicle_parts (
  part_id INT PRIMARY KEY,
  vehicle_id INT FK → vehicles,
  part_type VARCHAR(50), -- BATTERY, MOTOR, BMS, INVERTER, CHARGER
  serial_number VARCHAR(50) UNIQUE,
  part_name VARCHAR(100),
  installation_date DATE,
  warranty_months INT,
  is_original BOOLEAN, -- TRUE nếu là phụ tùng gốc từ nhà máy
  replaced_by INT FK → vehicle_parts (NULL if original),
  status VARCHAR(20), -- INSTALLED, REPLACED, FAULTY
  created_at TIMESTAMP
)

products (
  product_id INT PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE,
  product_name VARCHAR(200),
  category VARCHAR(50), -- BATTERY, MOTOR, etc.
  description TEXT,
  warranty_months INT,
  unit_price DECIMAL(10,2),
  is_active BOOLEAN,
  created_at TIMESTAMP
)
```

### 3. Service Centers
```sql
service_centers (
  center_id INT PRIMARY KEY,
  center_name VARCHAR(200),
  center_code VARCHAR(20) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  manager_name VARCHAR(100),
  is_active BOOLEAN,
  created_at TIMESTAMP
)

customer_vehicles (
  id INT PRIMARY KEY,
  customer_id INT FK → customers,
  vehicle_id INT FK → vehicles,
  service_center_id INT FK → service_centers,
  linked_date DATE,
  notes TEXT
)

customers (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP
)
```

### 4. Warranty Claims (Core Business Logic)
```sql
warranty_claims (
  claim_id INT PRIMARY KEY,
  claim_number VARCHAR(50) UNIQUE, -- Auto-generated: WC-2025-00001
  vehicle_id INT FK → vehicles,
  service_center_id INT FK → service_centers,
  technician_id INT FK → users,
  
  -- Claim details
  reported_issue TEXT,
  diagnosis_notes TEXT,
  claimed_mileage INT,
  claim_date DATE,
  
  -- Status workflow
  status VARCHAR(20), -- PENDING, APPROVED, REJECTED, IN_PROGRESS, COMPLETED
  evm_staff_id INT FK → users (Who approved/rejected),
  approval_date DATE,
  rejection_reason TEXT,
  
  -- Financial
  estimated_cost DECIMAL(10,2),
  approved_cost DECIMAL(10,2),
  labor_cost DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP
)

claim_parts (
  id INT PRIMARY KEY,
  claim_id INT FK → warranty_claims,
  product_id INT FK → products,
  faulty_serial_number VARCHAR(50), -- S/N của phụ tùng bị lỗi
  replacement_serial_number VARCHAR(50), -- S/N mới sau khi thay
  quantity INT DEFAULT 1,
  unit_cost DECIMAL(10,2),
  notes TEXT
)

claim_attachments (
  attachment_id INT PRIMARY KEY,
  claim_id INT FK → warranty_claims,
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  file_type VARCHAR(50), -- IMAGE, VIDEO, PDF, DIAGNOSTIC_REPORT
  file_size INT,
  uploaded_by INT FK → users,
  uploaded_at TIMESTAMP
)

claim_status_history (
  history_id INT PRIMARY KEY,
  claim_id INT FK → warranty_claims,
  from_status VARCHAR(20),
  to_status VARCHAR(20),
  changed_by INT FK → users,
  notes TEXT,
  changed_at TIMESTAMP
)
```

### 5. Campaigns (Recalls)
```sql
campaigns (
  campaign_id INT PRIMARY KEY,
  campaign_code VARCHAR(50) UNIQUE, -- RC-2025-001
  campaign_name VARCHAR(200),
  campaign_type VARCHAR(20), -- RECALL, SERVICE_CAMPAIGN
  description TEXT,
  issue_description TEXT,
  solution_description TEXT,
  
  -- Affected vehicles criteria
  affected_model VARCHAR(100),
  manufacturing_date_from DATE,
  manufacturing_date_to DATE,
  
  start_date DATE,
  end_date DATE,
  priority VARCHAR(20), -- HIGH, MEDIUM, LOW
  status VARCHAR(20), -- ACTIVE, COMPLETED, CANCELLED
  
  created_by INT FK → users,
  created_at TIMESTAMP
)

campaign_vehicles (
  id INT PRIMARY KEY,
  campaign_id INT FK → campaigns,
  vehicle_id INT FK → vehicles,
  service_center_id INT FK → service_centers,
  
  -- Status tracking
  status VARCHAR(30), -- PENDING_CONTACT, SCHEDULED, IN_PROGRESS, COMPLETED
  contact_date DATE,
  appointment_date DATE,
  completion_date DATE,
  notes TEXT,
  
  assigned_technician_id INT FK → users,
  created_at TIMESTAMP
)
```

### 6. Inventory (Parts Warehouse)
```sql
inventory (
  inventory_id INT PRIMARY KEY,
  product_id INT FK → products,
  quantity INT,
  min_stock_level INT,
  location VARCHAR(100), -- Warehouse location
  last_restocked_date DATE,
  updated_at TIMESTAMP
)

inventory_transactions (
  transaction_id INT PRIMARY KEY,
  product_id INT FK → products,
  transaction_type VARCHAR(20), -- IN (nhập kho), OUT (xuất kho), ADJUST
  quantity INT,
  claim_id INT FK → warranty_claims (NULL if not related to claim),
  service_center_id INT FK → service_centers (destination for OUT),
  notes TEXT,
  created_by INT FK → users,
  created_at TIMESTAMP
)
```

### 7. Service History
```sql
service_history (
  service_id INT PRIMARY KEY,
  vehicle_id INT FK → vehicles,
  service_center_id INT FK → service_centers,
  service_type VARCHAR(50), -- WARRANTY, MAINTENANCE, REPAIR
  service_date DATE,
  description TEXT,
  cost DECIMAL(10,2),
  technician_id INT FK → users,
  claim_id INT FK → warranty_claims (NULL if not warranty),
  created_at TIMESTAMP
)
```

## Key Relationships

```
Vehicle (VIN) 1:N Vehicle_Parts
Vehicle 1:N Warranty_Claims
Service_Center 1:N Users (SC Staff, Technician)
Warranty_Claim 1:N Claim_Parts
Warranty_Claim 1:N Claim_Attachments
Campaign 1:N Campaign_Vehicles
Product 1:N Inventory
```

## Status Workflows

### Warranty Claim Status Flow:
```
PENDING (Technician tạo) 
  → APPROVED (EVM duyệt) 
  → PARTS_ORDERED (Kho xuất phụ tùng)
  → IN_PROGRESS (Technician đang sửa) 
  → COMPLETED (Hoàn tất)

  → REJECTED (EVM từ chối) → CLOSED
```

### Campaign Vehicle Status Flow:
```
PENDING_CONTACT (Chưa liên hệ)
  → SCHEDULED (Đã hẹn lịch)
  → IN_PROGRESS (Đang xử lý)
  → COMPLETED (Hoàn tất)
```

## Indexes for Performance

```sql
CREATE INDEX idx_vin ON vehicles(vin);
CREATE INDEX idx_claim_status ON warranty_claims(status);
CREATE INDEX idx_claim_vehicle ON warranty_claims(vehicle_id);
CREATE INDEX idx_claim_center ON warranty_claims(service_center_id);
CREATE INDEX idx_campaign_status ON campaigns(status);
CREATE INDEX idx_part_serial ON vehicle_parts(serial_number);
```
