// Utility functions cho API calls với authentication
export const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Nếu token hết hạn hoặc không hợp lệ
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = '/login';
                return;
            }

            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Specific API functions
export const api = {
    // Vehicles
    getVehicles: () => apiRequest('http://localhost:3001/api/vehicles'),

    // Products
    getProducts: () => apiRequest('http://localhost:3001/api/products'),

    // Customers
    getCustomers: () => apiRequest('http://localhost:3001/api/customers'),

    // Vehicle Parts
    getVehicleParts: () => apiRequest('http://localhost:3001/api/vehicle-parts'),

    // Users (admin only)
    getUsers: () => apiRequest('http://localhost:3001/api/users'),

    // Health check (no auth required)
    checkHealth: () => fetch('http://localhost:3001/api/health').then(res => res.json()),
};

// 🎯 WARRANTY CLAIMS API - Theo đặc tả mới
export const warrantyAPI = {
    // Legacy 
    getAllWarranties: () => apiRequest('http://localhost:3001/api/warranties'),

    // 🎯 BƯỚC 1: Auto-fill thông tin từ VIN
    // API: GET /api/warranty-claims/vehicle-info/{vin}
    getVehicleInfo: (vin) => apiRequest(`http://localhost:3001/api/warranty-claims/vehicle-info/${vin}`),

    // 🎯 BƯỚC 2: Tạo đơn bảo hành  
    // API: POST /api/warranty-claims
    createClaim: (formData) => apiRequest('http://localhost:3001/api/warranty-claims', {
        method: 'POST',
        headers: {}, // Remove Content-Type for FormData
        body: formData
    }),

    // 🎯 CÁC API QUẢN LÝ ĐƠN SAU KHI TẠO
    // 1. GET /api/warranty-claims/service-center/{serviceCenterID} - DANH SÁCH ĐƠN của trung tâm
    getClaimsByServiceCenter: (serviceCenterID) =>
        apiRequest(`http://localhost:3001/api/warranty-claims/service-center/${serviceCenterID}`),

    // 2. GET /api/warranty-claims/{claimID} - CHI TIẾT 1 ĐƠN
    getClaimById: (claimID) =>
        apiRequest(`http://localhost:3001/api/warranty-claims/${claimID}`),

    // 3. GET /api/warranty-claims/vehicle/{vin} - LỊCH SỬ BẢO HÀNH của xe
    getClaimsByVin: (vin) =>
        apiRequest(`http://localhost:3001/api/warranty-claims/vehicle/${vin}`),
};

export const vehicleAPI = {
    getAllVehicles: () => apiRequest('http://localhost:3001/api/vehicles'),
    getVehicleByVin: (vin) => apiRequest(`http://localhost:3001/api/vehicles/vin/${vin}`),
    getVehicleParts: (vin) => apiRequest(`http://localhost:3001/api/vehicles/${vin}/parts`),
};

export const uploadAPI = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiRequest('http://localhost:3001/api/upload', {
            method: 'POST',
            headers: {}, // Remove Content-Type for FormData
            body: formData
        });
    },
};

export const customerAPI = {
    getAllCustomers: () => apiRequest('http://localhost:3001/api/customers'),
};

export const assignmentAPI = {
    getAllAssignments: () => apiRequest('http://localhost:3001/api/assignments'),
};

export const executionAPI = {
    getAllExecutions: () => apiRequest('http://localhost:3001/api/executions'),
};