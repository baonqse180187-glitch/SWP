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

  // Mock users data
  const mockUsers = {
    'admin': { 
      id: 1, 
      username: 'admin', 
      role: 'admin', 
      name: 'Quản trị viên',
      permissions: ['all']
    },
    'evm_staff': { 
      id: 2, 
      username: 'evm_staff', 
      role: 'evm_staff', 
      name: 'Nhân viên EVM',
      permissions: ['view_vehicles', 'manage_claims', 'view_reports']
    },
    'sc_staff': { 
      id: 3, 
      username: 'sc_staff', 
      role: 'sc_staff', 
      name: 'Nhân viên SC',
      permissions: ['manage_vehicles', 'create_claims', 'view_claims', 'manage_recalls']
    },
    'sc_technician': { 
      id: 4, 
      username: 'sc_technician', 
      role: 'sc_technician', 
      name: 'Kỹ thuật viên SC',
      permissions: ['view_claims', 'update_claims', 'manage_parts', 'perform_warranty']
    },
    'technician': { 
      id: 5, 
      username: 'technician', 
      role: 'technician', 
      name: 'Kỹ thuật viên',
      permissions: ['view_claims', 'update_claims']
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - Updated password validation
      const validPasswords = ['admin123', 'evm123', 'sc123', 'tech123', 'sctech123'];
      
      if (mockUsers[username] && validPasswords.includes(password)) {
        const userData = mockUsers[username];
        const token = `mock_token_${username}_${Date.now()}`;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Tên đăng nhập hoặc mật khẩu không đúng' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Đăng nhập thất bại' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
