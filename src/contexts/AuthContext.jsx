import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'
import { ROLES, ROLE_PERMISSIONS } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkAuth() }, [])

  // Helper function: Decode JWT token to get user info
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Failed to decode JWT:', error)
      return null
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        // Decode JWT để lấy thông tin user
        const decodedToken = decodeJWT(token)

        if (decodedToken) {
          // Kiểm tra token có hết hạn không
          const currentTime = Date.now() / 1000
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            console.log('Token đã hết hạn')
            localStorage.clear()
            return
          }

          const userData = {
            userId: decodedToken?.userId,
            username: decodedToken?.sub,
            email: decodedToken?.email,
            fullName: decodedToken?.fullName,
            role: {
              roleName: decodedToken?.role || decodedToken?.scope
            }
          }
          setUser(userData)
        } else {
          localStorage.clear()
        }
      }
    } catch (error) {
      console.error('Check auth error:', error)
      localStorage.clear()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      console.log('Đang gửi request login...', credentials)
      const response = await authAPI.login(credentials)
      console.log('Login response:', response.data)

      // Backend trả về: { code: 0, result: { token, authenticated } }
      const result = response.data?.result
      const token = result?.token

      if (!token) {
        console.error('❌ Không có token trong response:', response.data)
        throw new Error('No access token received')
      }

      console.log('Token nhận được, length:', token.length)
      localStorage.setItem('accessToken', token)

      // Decode JWT để lấy thông tin user từ token
      const decodedToken = decodeJWT(token)
      console.log('Decoded token:', decodedToken)

      // Tạo object user từ thông tin trong token
      const userData = {
        userId: decodedToken?.userId,
        username: decodedToken?.sub,
        email: decodedToken?.email,
        fullName: decodedToken?.fullName,
        role: {
          roleName: decodedToken?.role || decodedToken?.scope
        }
      }

      console.log('User data:', userData)
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
      }
    }
  }

  const logout = async () => {
    try { await authAPI.logout() } finally { localStorage.clear(); setUser(null) }
  }

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await authAPI.resetPassword(token, newPassword)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message }
    }
  }

  const hasPermission = (p) => {
    const roleName = user?.role?.roleName || user?.role
    return roleName && ROLE_PERMISSIONS[roleName]?.includes(p)
  }

  const hasRole = (r) => {
    const roleName = user?.role?.roleName || user?.role
    // Backend trả về "ROLE_ADMIN", so sánh với "ADMIN"
    const roleWithoutPrefix = roleName?.replace('ROLE_', '')
    return roleWithoutPrefix === r || roleName === r
  }

  const hasAnyRole = (roles) => {
    const roleName = user?.role?.roleName || user?.role
    // Backend trả về "ROLE_ADMIN", so sánh với "ADMIN"
    const roleWithoutPrefix = roleName?.replace('ROLE_', '')
    return roles.some(r => roleWithoutPrefix === r || roleName === r)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    // Backend trả về "ROLE_ADMIN", loại bỏ prefix "ROLE_"
    role: (user?.role?.roleName || user?.role)?.replace('ROLE_', ''),
    login,
    logout,
    forgotPassword,
    resetPassword,
    hasPermission,
    hasRole,
    hasAnyRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export { ROLES }
