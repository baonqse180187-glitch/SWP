import axiosInstance from './axios'

// ==================== AUTH API ====================
export const authAPI = {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    logout: () => axiosInstance.post('/auth/logout'),
    introspect: (token) => axiosInstance.post('/auth/introspect', { token }),
    refreshToken: (refreshToken) => axiosInstance.post('/auth/refresh', { refreshToken }),
    getCurrentUser: () => axiosInstance.get('/users/myInfo'),
    // Reset Password Flow
    forgotPassword: (email) => axiosInstance.post('/users/forgot-password', { email }),
    verifyOtp: (data) => axiosInstance.post('/users/verify-otp', data), // { email, otp }
    resetPassword: (data) => axiosInstance.post('/users/reset-password', data), // { email, otp, newPassword }
}

// ==================== USER API ====================
export const userAPI = {
    getUsers: (params) => axiosInstance.get('/users', { params }),
    getUserById: (id) => axiosInstance.get(`/users/${id}`),
    createUser: (userData) => axiosInstance.post('/users/register', userData),
    updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),
    deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
    changePassword: (userId, passwordData) => axiosInstance.put(`/users/${userId}/change-password`, passwordData),
}

// ==================== VEHICLE API ====================
export const vehicleAPI = {
    getVehicles: (params) => axiosInstance.get('/vehicles', { params }),
    getVehicleById: (id) => axiosInstance.get(`/vehicles/${id}`),
    getVehicleByVIN: (vin) => axiosInstance.get(`/vehicles/vin/${vin}`),
    createVehicle: (data) => axiosInstance.post('/vehicles', data),
    updateVehicle: (id, data) => axiosInstance.put(`/vehicles/${id}`, data),
    deleteVehicle: (id) => axiosInstance.delete(`/vehicles/${id}`),
    getVehiclesByCustomer: (customerId) => axiosInstance.get(`/vehicles/customer/${customerId}`),
}

// ==================== WARRANTY CLAIM API ====================
export const warrantyClaimAPI = {
    getClaims: (params) => axiosInstance.get('/warranty-claims', { params }),
    getClaimById: (id) => axiosInstance.get(`/warranty-claims/${id}`),
    createClaim: (data) => axiosInstance.post('/warranty-claims', data),
    updateClaim: (id, data) => axiosInstance.put(`/warranty-claims/${id}`, data),
    deleteClaim: (id) => axiosInstance.delete(`/warranty-claims/${id}`),
    approveClaim: (id, data) => axiosInstance.put(`/warranty-claims/${id}/approve`, data),
    rejectClaim: (id, reason) => axiosInstance.put(`/warranty-claims/${id}/reject`, { reason }),
    assignClaim: (id, technicianId) => axiosInstance.put(`/warranty-claims/${id}/assign`, { technicianId }),
    updateClaimStatus: (id, status) => axiosInstance.put(`/warranty-claims/${id}/status`, { status }),
    getClaimsByStatus: (status) => axiosInstance.get('/warranty-claims/status', { params: { status } }),
    uploadAttachment: (claimId, formData) => axiosInstance.post(`/warranty-claims/${claimId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAttachment: (claimId, attachmentId) => axiosInstance.delete(`/warranty-claims/${claimId}/attachments/${attachmentId}`),
}

// ==================== SERVICE CENTER API ====================
export const serviceCenterAPI = {
    getServiceCenters: (params) => axiosInstance.get('/service-centers', { params }),
    getServiceCenterById: (id) => axiosInstance.get(`/service-centers/${id}`),
    createServiceCenter: (data) => axiosInstance.post('/service-centers', data),
    updateServiceCenter: (id, data) => axiosInstance.put(`/service-centers/${id}`, data),
    deleteServiceCenter: (id) => axiosInstance.delete(`/service-centers/${id}`),
}

// ==================== PART API ====================
export const partAPI = {
    getParts: (params) => axiosInstance.get('/parts', { params }),
    getPartById: (id) => axiosInstance.get(`/parts/${id}`),
    createPart: (data) => axiosInstance.post('/parts', data),
    updatePart: (id, data) => axiosInstance.put(`/parts/${id}`, data),
    deletePart: (id) => axiosInstance.delete(`/parts/${id}`),
    getPartsByType: (typeId) => axiosInstance.get(`/parts/type/${typeId}`),
    searchParts: (keyword) => axiosInstance.get('/parts/search', { params: { keyword } }),
}

// ==================== PART TYPE API ====================
export const partTypeAPI = {
    getPartTypes: () => axiosInstance.get('/part-types'),
    getPartTypeById: (id) => axiosInstance.get(`/part-types/${id}`),
    createPartType: (data) => axiosInstance.post('/part-types', data),
    updatePartType: (id, data) => axiosInstance.put(`/part-types/${id}`, data),
    deletePartType: (id) => axiosInstance.delete(`/part-types/${id}`),
}

// ==================== INSTALLED PART API ====================
export const installedPartAPI = {
    getInstalledParts: (params) => axiosInstance.get('/installed-parts', { params }),
    getInstalledPartById: (id) => axiosInstance.get(`/installed-parts/${id}`),
    createInstalledPart: (data) => axiosInstance.post('/installed-parts', data),
    updateInstalledPart: (id, data) => axiosInstance.put(`/installed-parts/${id}`, data),
    deleteInstalledPart: (id) => axiosInstance.delete(`/installed-parts/${id}`),
    getInstalledPartsByVehicle: (vehicleId) => axiosInstance.get(`/installed-parts/vehicle/${vehicleId}`),
}

// ==================== SERVICE HISTORY API ====================
export const serviceHistoryAPI = {
    getServiceHistories: (params) => axiosInstance.get('/service-histories', { params }),
    getServiceHistoryById: (id) => axiosInstance.get(`/service-histories/${id}`),
    createServiceHistory: (data) => axiosInstance.post('/service-histories', data),
    updateServiceHistory: (id, data) => axiosInstance.put(`/service-histories/${id}`, data),
    deleteServiceHistory: (id) => axiosInstance.delete(`/service-histories/${id}`),
    getServiceHistoriesByVehicle: (vehicleId) => axiosInstance.get(`/service-histories/vehicle/${vehicleId}`),
}

// ==================== PRODUCT API ====================
export const productAPI = {
    getProducts: (params) => axiosInstance.get('/products', { params }),
    getProductById: (id) => axiosInstance.get(`/products/${id}`),
    createProduct: (data) => axiosInstance.post('/products', data),
    updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),
    deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
    searchProducts: (keyword) => axiosInstance.get('/products/search', { params: { keyword } }),
}

// ==================== CAMPAIGN API ====================
export const campaignAPI = {
    getCampaigns: (params) => axiosInstance.get('/campaigns', { params }),
    getCampaignById: (id) => axiosInstance.get(`/campaigns/${id}`),
    createCampaign: (data) => axiosInstance.post('/campaigns', data),
    updateCampaign: (id, data) => axiosInstance.put(`/campaigns/${id}`, data),
    deleteCampaign: (id) => axiosInstance.delete(`/campaigns/${id}`),
    getCampaignsByStatus: (status) => axiosInstance.get('/campaigns/status', { params: { status } }),
}

// ==================== APPOINTMENT API ====================
export const appointmentAPI = {
    getAppointments: (params) => axiosInstance.get('/appointments', { params }),
    getAppointmentById: (id) => axiosInstance.get(`/appointments/${id}`),
    createAppointment: (data) => axiosInstance.post('/appointments', data),
    updateAppointment: (id, data) => axiosInstance.put(`/appointments/${id}`, data),
    deleteAppointment: (id) => axiosInstance.delete(`/appointments/${id}`),
    confirmAppointment: (id) => axiosInstance.put(`/appointments/${id}/confirm`),
    cancelAppointment: (id, reason) => axiosInstance.put(`/appointments/${id}/cancel`, { reason }),
}

// ==================== NOTIFICATION API ====================
export const notificationAPI = {
    getNotifications: (params) => axiosInstance.get('/notifications', { params }),
    getNotificationById: (id) => axiosInstance.get(`/notifications/${id}`),
    markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
    markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
    deleteNotification: (id) => axiosInstance.delete(`/notifications/${id}`),
}

// ==================== FILE UPLOAD API ====================
export const fileAPI = {
    uploadFile: (file, type) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        return axiosInstance.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    uploadMultipleFiles: (files, type) => {
        const formData = new FormData()
        files.forEach((file) => formData.append('files', file))
        formData.append('type', type)
        return axiosInstance.post('/files/upload-multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    deleteFile: (fileId) => axiosInstance.delete(`/files/${fileId}`),
    getFile: (fileId) => axiosInstance.get(`/files/${fileId}`),
}

// ==================== DASHBOARD/REPORT API ====================
export const reportAPI = {
    getDashboardStats: (params) => axiosInstance.get('/reports/dashboard', { params }),
    getClaimTrends: (params) => axiosInstance.get('/reports/claim-trends', { params }),
    getFailureRateByPart: (params) => axiosInstance.get('/reports/failure-rate/part', { params }),
    getFailureRateByModel: (params) => axiosInstance.get('/reports/failure-rate/model', { params }),
    getWarrantyClaimStats: (params) => axiosInstance.get('/reports/warranty-claims', { params }),
    getServiceCenterStats: (params) => axiosInstance.get('/reports/service-centers', { params }),
    getPartUsageStats: (params) => axiosInstance.get('/reports/parts-usage', { params }),
    exportReport: (reportType, params) => axiosInstance.get(`/reports/export/${reportType}`, {
        params,
        responseType: 'blob'
    }),
}