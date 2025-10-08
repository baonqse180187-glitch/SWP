import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on app start
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }

    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      console.log('🔑 Attempting login with:', credentials)
      console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')

      // First try API login
      try {
        const response = await authAPI.login(credentials)
        console.log('📩 Login response:', response)

        if (response.data.success) {
          const { token, user: userData } = response.data

          localStorage.setItem('auth_token', token)
          localStorage.setItem('user_data', JSON.stringify(userData))

          setUser(userData)
          return { success: true }
        } else {
          throw new Error(response.data.message || 'Đăng nhập thất bại')
        }
      } catch (apiError) {
        console.log('🔄 API login failed, trying mock authentication...')
        console.log('🔍 Received credentials:', credentials)

        // Mock authentication fallback for testing new roles
        const mockUsers = [
          {
            id: 1,
            username: 'evmadmin',
            email: 'evmadmin',
            password: 'admin123',
            name: 'EVM Admin',
            role: 'EVM_ADMIN',
            permissions: ['manufacturer_functions', 'reports_analytics', 'ai_analysis']
          },
          {
            id: 2,
            username: 'evmstaff',
            email: 'evmstaff',
            password: 'staff123',
            name: 'EVM Staff',
            role: 'EVM_STAFF',
            permissions: ['product_management', 'warranty_management', 'supply_chain']
          },
          {
            id: 3,
            username: 'scstaff',
            email: 'scstaff',
            password: 'sc123',
            name: 'SC Staff',
            role: 'SC_STAFF',
            permissions: ['customer_management_by_vin', 'vin_registration', 'warranty_request_creation', 'internal_management', 'warranty_execution']
          },
          {
            id: 4,
            username: 'sctech',
            email: 'sctech',
            password: 'tech123',
            name: 'SC Technician',
            role: 'SC_TECHNICIAN',
            permissions: ['warranty_execution']
          }
        ]

        console.log('🔍 Available mock users:', mockUsers.map(u => u.username))

        const user = mockUsers.find(u =>
          (u.username === credentials.username || u.username === credentials.email ||
            u.email === credentials.username || u.email === credentials.email) &&
          u.password === credentials.password
        )

        console.log('🔍 Found user:', user ? user.name : 'Not found')
        console.log('🔍 Checking credentials:', {
          inputUsername: credentials.username,
          inputEmail: credentials.email,
          inputPassword: credentials.password
        })

        if (user) {
          const { password, ...userData } = user
          const mockToken = 'mock-jwt-token-' + user.id

          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('user_data', JSON.stringify(userData))

          setUser(userData)
          console.log('✅ Mock login successful for:', userData.name)
          return { success: true }
        } else {
          throw new Error('Tên đăng nhập hoặc mật khẩu không đúng')
        }
      }
    } catch (error) {
      console.error('❌ Login error details:', error)
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại'
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const updateUserProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    // Helper functions for role-based access - Updated according to new requirements
    isEVMAdmin: user?.role === 'EVM_ADMIN',
    isEVMStaff: user?.role === 'EVM_STAFF',
    isSCStaff: user?.role === 'SC_STAFF',
    isSCTechnician: user?.role === 'SC_TECHNICIAN',
    // Legacy compatibility
    isStaff: user?.role === 'SC_STAFF' || user?.role === 'EVM_STAFF',
    isTechnician: user?.role === 'SC_TECHNICIAN',
    isAdmin: user?.role === 'EVM_ADMIN',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}