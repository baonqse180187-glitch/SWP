import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Gọi API login
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Đăng nhập thất bại'
        };
      }

      // Lưu token và user data từ response structure mới
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userData', JSON.stringify(data.data.user));

      setUser(data.data.user);

      return {
        success: true,
        message: data.message,
        user: data.data.user,
        token: data.data.token
      };

    } catch (error) {
      return {
        success: false,
        message: 'Lỗi kết nối đến server'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Kiểm tra xem user có quyền truy cập không
  const hasPermission = (permission) => {
    if (!user) return false;

    // Admin có tất cả quyền
    if (user.role === 'EVM_ADMIN') return true;

    // Định nghĩa quyền cho từng role
    const rolePermissions = {
      'EVM_STAFF': ['manage_products', 'view_reports', 'manage_supply_chain'],
      'SC_STAFF': ['find_vin', 'register_vin', 'create_warranty'],
      'SC_TECHNICIAN': ['execute_warranty', 'update_warranty_status']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
