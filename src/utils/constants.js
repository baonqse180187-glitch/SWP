// User roles
export const USER_ROLES = {
  SC_STAFF: 'SC_STAFF',
  SC_TECHNICIAN: 'SC_TECHNICIAN',
  ADMIN: 'ADMIN',
  EVM_STAFF: 'EVM_STAFF'
}

// Warranty request statuses
export const WARRANTY_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PARTS_RECEIVED: 'parts_received'
}

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  MEDIUM: 'medium',
  HIGH: 'high'
}

// Part types
export const PART_TYPES = {
  MAIN: 'main',
  AUXILIARY: 'auxiliary'
}

// Service types
export const SERVICE_TYPES = {
  WARRANTY: 'warranty',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair'
}

// File types
export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  CUSTOMERS: {
    BASE: '/customers',
    SEARCH: '/customers/search',
    BY_VIN: '/customers/vin'
  },
  VEHICLES: {
    BASE: '/vehicles',
    PARTS: '/parts',
    SERVICE_HISTORY: '/service-history',
    NOTES: '/notes'
  },
  WARRANTY: {
    REQUESTS: '/warranty/requests',
    SUBMIT: '/submit',
    FILES: '/files',
    ASSIGNMENTS: '/warranty/assignments'
  },
  TECHNICIANS: {
    BASE: '/technicians',
    PERFORMANCE: '/performance',
    WORKLOAD: '/workload'
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    FILES: '/upload/files'
  }
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches'
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm'
}

// Validation rules
export const VALIDATION = {
  VIN_LENGTH: 17,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 6,
  NOTES_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000
}

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
}

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 'NETWORK_ERROR'
}

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  SAVE_SUCCESS: 'Lưu thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  UPLOAD_SUCCESS: 'Tải lên thành công',
  ASSIGNMENT_SUCCESS: 'Phân công thành công',
  SUBMISSION_SUCCESS: 'Gửi yêu cầu thành công'
}

// Error messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  SERVER_ERROR: 'Lỗi máy chủ',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNAUTHORIZED: 'Không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  UPLOAD_FAILED: 'Tải lên thất bại',
  FILE_TOO_LARGE: 'File quá lớn',
  INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
  REQUIRED_FIELD: 'Trường này là bắt buộc',
  INVALID_VIN: 'Số VIN không hợp lệ',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ'
}

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  DATE: 'date',
  DATETIME: 'datetime-local',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file'
}

// Table column types
export const COLUMN_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  STATUS: 'status',
  ACTIONS: 'actions',
  CHECKBOX: 'checkbox'
}

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area'
}

// Export formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'xlsx',
  CSV: 'csv'
}

// Vehicle models (example data)
export const VEHICLE_MODELS = [
  'EV-300',
  'EV-400',
  'EV-500',
  'EV-600',
  'EV-SUV-300',
  'EV-SUV-400',
  'EV-TRUCK-500'
]

// Technician specialties
export const TECHNICIAN_SPECIALTIES = [
  'Điện',
  'Động cơ',
  'Pin',
  'ECU',
  'Thân vỏ',
  'Hộp số',
  'Phanh',
  'Điều hòa'
]

// Common parts
export const COMMON_PARTS = [
  'Động cơ điện',
  'Pin HV',
  'ECU',
  'Hộp số',
  'Bộ sạc',
  'BMS',
  'Inverter',
  'Màn hình trung tâm',
  'Cảm biến',
  'Hệ thống phanh'
]

export default {
  USER_ROLES,
  WARRANTY_STATUS,
  PRIORITY_LEVELS,
  PART_TYPES,
  SERVICE_TYPES,
  FILE_TYPES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION,
  UPLOAD_LIMITS,
  ERROR_CODES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  NOTIFICATION_TYPES,
  FIELD_TYPES,
  COLUMN_TYPES,
  CHART_TYPES,
  EXPORT_FORMATS,
  VEHICLE_MODELS,
  TECHNICIAN_SPECIALTIES,
  COMMON_PARTS
}