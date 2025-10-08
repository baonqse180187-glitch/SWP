import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, WrenchScrewdriverIcon } from '../components/Icons'
import { usersAPI } from '../services/api'

const LoginPage = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiStatus, setApiStatus] = useState('Đang kiểm tra...')
  const [usersData, setUsersData] = useState(null)

  // Kết nối backend để lấy danh sách users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setApiStatus('Đang kết nối...');
        const response = await usersAPI.getAllUsers();
        console.log('Danh sách users từ backend:', response.data);
        setUsersData(response.data);
        setApiStatus('Kết nối thành công ✅');
      } catch (error) {
        console.error('Lỗi khi gọi API users:', error);
        setApiStatus('Lỗi kết nối ❌');

        // Fallback - sử dụng fetch trực tiếp nếu service API không hoạt động
        try {
          const response = await fetch("http://localhost:3001/api/users");
          const data = await response.json();
          console.log('Fallback - Users data:', data);
          setUsersData(data);
          setApiStatus('Kết nối fallback thành công ✅');
        } catch (err) {
          console.error('Lỗi khi gọi API fallback:', err);
          setApiStatus('Không thể kết nối backend ❌');
        }
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Test backend connection first
    console.log('🔍 Testing backend connection...')
    console.log('📍 Backend URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')
    console.log('📝 Form data being sent:', {
      username: formData.username,
      email: formData.email,
      password: formData.password ? '***' : 'empty'
    })

    try {
      const result = await login(formData)
      console.log('🎯 Login result:', result)

      if (!result.success) {
        setError(result.message)
      }
    } catch (error) {
      console.error('💥 Login exception:', error)
      setError('Đã xảy ra lỗi khi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <WrenchScrewdriverIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            TRUNG TÂM BẢO HÀNH OEM
          </h2>
          <p className="mt-2 text-sm text-primary-200">
            Đăng nhập vào hệ thống quản lý bảo hành xe điện
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input pr-10"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Lỗi đăng nhập
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.username || !formData.password}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || !formData.username || !formData.password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    } transition-colors duration-200`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Demo Accounts - Updated for new role system */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">Tài khoản :</h3>
          <div className="space-y-2 text-xs text-primary-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-green-300">EVM Admin:</span> evmadmin / admin123
                <div className="text-[10px] text-primary-300 ml-2">→ Chức năng Hãng sản xuất xe, AI phân tích</div>
              </div>
              <button
                onClick={() => setFormData({ username: 'evmadmin', email: 'evmadmin', password: 'admin123' })}
                className="px-2 py-1 text-[10px] bg-green-600 text-white rounded hover:bg-green-700"
              >
                Fill
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-blue-300">EVM Staff:</span> evmstaff / staff123
                <div className="text-[10px] text-primary-300 ml-2">→ Quản lý sản phẩm & phụ tùng, Chuỗi cung ứng</div>
              </div>
              <button
                onClick={() => setFormData({ username: 'evmstaff', email: 'evmstaff', password: 'staff123' })}
                className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fill
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-orange-300">SC Staff:</span> scstaff / sc123
                <div className="text-[10px] text-primary-300 ml-2">→ Tìm VIN, Đăng ký VIN, Tạo yêu cầu BH</div>
              </div>
              <button
                onClick={() => setFormData({ username: 'scstaff', email: 'scstaff', password: 'sc123' })}
                className="px-2 py-1 text-[10px] bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Fill
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-purple-300">SC Technician:</span> sctech / tech123
                <div className="text-[10px] text-primary-300 ml-2">→ Thực hiện bảo hành</div>
              </div>
              <button
                onClick={() => setFormData({ username: 'sctech', email: 'sctech', password: 'tech123' })}
                className="px-2 py-1 text-[10px] bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Fill
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-primary-300">
            OEM Electric Vehicle Warranty Center. <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage