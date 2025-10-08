import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
}

// Customer API
export const customerAPI = {
  searchCustomers: (params) => api.get('/customers/search', { params }),
  getCustomerByVin: (vin) => api.get(`/customers/vin/${vin}`),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  getCustomerVehicles: (customerId) => api.get(`/customers/${customerId}/vehicles`),
}

// Vehicle API
export const vehicleAPI = {
  getVehicleByVin: (vin) => api.get(`/vehicles/${vin}`),
  getVehicleDetails: (vin) => api.get(`/vehicles/${vin}/details`),
  getVehicleParts: (vin) => api.get(`/vehicles/${vin}/parts`),
  updateVehiclePart: (vin, partId, data) => api.put(`/vehicles/${vin}/parts/${partId}`, data),
  addVehiclePart: (vin, data) => api.post(`/vehicles/${vin}/parts`, data),
  getServiceHistory: (vin) => api.get(`/vehicles/${vin}/service-history`),
  addServiceRecord: (vin, data) => api.post(`/vehicles/${vin}/service-history`, data),
  updateVehicleNotes: (vin, notes) => api.put(`/vehicles/${vin}/notes`, { notes }),
}

// Warranty API
export const warrantyAPI = {
  // Create warranty request
  createWarrantyRequest: (data) => api.post('/warranty/requests', data),

  // Get warranty requests
  getWarrantyRequests: (params) => api.get('/warranty/requests', { params }),
  getWarrantyRequestById: (id) => api.get(`/warranty/requests/${id}`),

  // Update warranty request
  updateWarrantyRequest: (id, data) => api.put(`/warranty/requests/${id}`, data),
  deleteWarrantyRequest: (id) => api.delete(`/warranty/requests/${id}`),

  // Submit to manufacturer
  submitToManufacturer: (id) => api.post(`/warranty/requests/${id}/submit`),

  // Status updates
  updateRequestStatus: (id, status, notes) => api.put(`/warranty/requests/${id}/status`, { status, notes }),

  // File uploads
  uploadFiles: (requestId, files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    return api.post(`/warranty/requests/${requestId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Get files
  getRequestFiles: (requestId) => api.get(`/warranty/requests/${requestId}/files`),
  deleteFile: (requestId, fileId) => api.delete(`/warranty/requests/${requestId}/files/${fileId}`),
}

// Assignment API (for SC Staff)
export const assignmentAPI = {
  // Get available technicians
  getTechnicians: () => api.get('/technicians'),

  // Assign warranty request to technician
  assignRequest: (requestId, technicianId, notes) =>
    api.post(`/warranty/requests/${requestId}/assign`, { technicianId, notes }),

  // Get assigned requests
  getAssignedRequests: (params) => api.get('/warranty/assignments', { params }),

  // Update assignment
  updateAssignment: (assignmentId, data) => api.put(`/warranty/assignments/${assignmentId}`, data),

  // Performance tracking
  getTechnicianPerformance: (technicianId, period) =>
    api.get(`/technicians/${technicianId}/performance`, { params: { period } }),

  // Workload tracking
  getTechnicianWorkload: () => api.get('/technicians/workload'),
}

// Execution API (for SC Technician)
export const executionAPI = {
  // Get assigned requests for current technician
  getMyRequests: (params) => api.get('/warranty/my-requests', { params }),

  // Update request progress
  updateProgress: (requestId, data) => api.put(`/warranty/requests/${requestId}/progress`, data),

  // Parts management
  confirmPartsReceived: (requestId, partsData) =>
    api.post(`/warranty/requests/${requestId}/parts/confirm`, partsData),

  reportPartsIssue: (requestId, issueData) =>
    api.post(`/warranty/requests/${requestId}/parts/issue`, issueData),

  // Work completion
  completeWork: (requestId, completionData) =>
    api.post(`/warranty/requests/${requestId}/complete`, completionData),

  // Technical feedback
  submitTechnicalFeedback: (requestId, feedback) =>
    api.post(`/warranty/requests/${requestId}/feedback`, feedback),
}

// Reports API
export const reportsAPI = {
  getWarrantyStatistics: (params) => api.get('/reports/warranty-stats', { params }),
  getTechnicianEfficiency: (params) => api.get('/reports/technician-efficiency', { params }),
  getWarrantyTrends: (params) => api.get('/reports/warranty-trends', { params }),
  exportWarrantyData: (params) => api.get('/reports/export/warranty', {
    params,
    responseType: 'blob'
  }),
}

// File/Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  uploadDocument: (file) => {
    const formData = new FormData()
    formData.append('document', file)
    return api.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deleteFile: (fileId) => api.delete(`/upload/files/${fileId}`),
}

// Settings API
export const settingsAPI = {
  getSystemSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getNotificationSettings: () => api.get('/settings/notifications'),
  updateNotificationSettings: (data) => api.put('/settings/notifications', data),
}

export default api