import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from '../components/Icons'

import CustomerSearch from '../components/CustomerSearch'
import WarrantyManagement from '../components/WarrantyManagement'
import WarrantyAssignment from '../components/WarrantyAssignment'
import RepairProgress from '../components/RepairProgress'

const HomePage = () => {
  const { user, isEVMAdmin, isEVMStaff, isSCStaff, isSCTechnician } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  // Get available modules based on user role - Updated according to new requirements
  const getAvailableModules = () => {
    const modules = []

    // Dashboard luôn có cho tất cả vai trò
    modules.push({
      key: 'dashboard',
      label: 'Dashboard',
      description: 'Tổng quan hệ thống',
      icon: ChartBarIcon,
      color: 'text-blue-600'
    })

    // EVM Admin - Chức năng cho Hãng sản xuất xe
    if (isEVMAdmin) {
      modules.push(
        {
          key: 'customer-search',
          label: 'Quản lý Database',
          description: 'Cơ sở dữ liệu khách hàng & xe',
          icon: MagnifyingGlassIcon,
          color: 'text-green-600'
        },
        {
          key: 'warranty-management',
          label: 'Chức năng Hãng xe',
          description: 'Toàn quyền quản lý',
          icon: ClipboardDocumentListIcon,
          color: 'text-purple-600'
        },
        {
          key: 'warranty-assignment',
          label: 'Báo cáo & Phân tích',
          description: 'Thống kê & phân tích dữ liệu',
          icon: UserGroupIcon,
          color: 'text-orange-600'
        }
      )
    }

    // EVM Staff - Quản lý sản phẩm & phụ tùng
    else if (isEVMStaff) {
      modules.push(
        {
          key: 'customer-search',
          label: 'Quản lý sản phẩm',
          description: 'Cơ sở dữ liệu sản phẩm & phụ tùng',
          icon: MagnifyingGlassIcon,
          color: 'text-green-600'
        },
        {
          key: 'warranty-management',
          label: 'Quản lý yêu cầu BH',
          description: 'Tiếp nhận & phê duyệt yêu cầu',
          icon: ClipboardDocumentListIcon,
          color: 'text-purple-600'
        },
        {
          key: 'warranty-assignment',
          label: 'Chuỗi cung ứng',
          description: 'Quản lý phụ tùng bảo hành',
          icon: UserGroupIcon,
          color: 'text-orange-600'
        }
      )
    }

    // SC Staff - Quản lý hồ sơ xe & khách hàng
    else if (isSCStaff) {
      modules.push(
        {
          key: 'customer-search',
          label: 'Quản lý khách hàng',
          description: 'Tìm kiếm theo VIN, Đăng ký VIN',
          icon: MagnifyingGlassIcon,
          color: 'text-green-600'
        },
        {
          key: 'warranty-management',
          label: 'Tạo yêu cầu BH',
          description: 'Tạo yêu cầu bảo hành gửi hãng',
          icon: ClipboardDocumentListIcon,
          color: 'text-purple-600'
        },
        {
          key: 'warranty-assignment',
          label: 'Phân công bảo hành',
          description: 'Phân công kỹ thuật viên',
          icon: UserGroupIcon,
          color: 'text-orange-600'
        }
      )
    }

    // SC Technician - Chỉ thực hiện bảo hành
    else if (isSCTechnician) {
      modules.push(
        {
          key: 'repair-progress',
          label: 'Thực hiện bảo hành',
          description: 'Nhận phụ tùng & sửa chữa',
          icon: WrenchScrewdriverIcon,
          color: 'text-red-600'
        }
      )
    }

    return modules
  }

  // Thống kê nhanh (những thông tin này sẽ được lấy từ API trong quá trình triển khai thực tế)
  const quickStats = [
    {
      title: 'Yêu cầu bảo hành',
      value: '24',
      subtitle: 'Hôm nay',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Khách hàng',
      value: '156',
      subtitle: 'Tổng số',
      icon: UsersIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Đang xử lý',
      value: '8',
      subtitle: 'Yêu cầu',
      icon: WrenchScrewdriverIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Hoàn thành',
      value: '142',
      subtitle: 'Tháng này',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ]

  // Hoạt động gần đây (dữ liệu giả)
  const recentActivities = [
    {
      id: 1,
      type: 'warranty_created',
      message: 'Yêu cầu bảo hành mới được tạo cho xe VIN: WBABC123',
      time: '10 phút trước',
      user: 'Nguyễn Văn A'
    },
    {
      id: 2,
      type: 'assignment',
      message: 'Phân công kỹ thuật viên Trần Văn B xử lý yêu cầu #WR-2025-001',
      time: '30 phút trước',
      user: 'Phạm Thị C'
    },
    {
      id: 3,
      type: 'completion',
      message: 'Hoàn thành bảo hành cho xe VIN: WBABC456',
      time: '1 giờ trước',
      user: 'Lê Văn D'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name || 'User'}!
            </h1>
            <p className="text-primary-100">
              Chào mừng đến với hệ thống quản lý bảo hành xe điện OEM
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-200">
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Module Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Chọn chức năng</h2>
          <div className="text-sm text-gray-500">
            Vai trò: <span className="font-medium text-blue-600">
              {isEVMAdmin ? 'EVM Admin (Hãng sản xuất)' :
                isEVMStaff ? 'EVM Staff (Quản lý sản phẩm)' :
                  isSCStaff ? 'SC Staff (Trung tâm dịch vụ)' :
                    isSCTechnician ? 'SC Technician (Kỹ thuật viên)' : 'Unknown'}
            </span>
          </div>
        </div>

        <div className={`grid gap-4 ${getAvailableModules().length <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {getAvailableModules().map((module) => (
            <button
              key={module.key}
              onClick={() => setActiveModule(module.key)}
              className={`p-4 rounded-lg border-2 transition-all ${activeModule === module.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <module.icon className={`h-8 w-8 ${module.color}`} />
                <span className="font-medium text-gray-900">{module.label}</span>
                <span className="text-sm text-gray-500">{module.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Role-based notifications - Updated */}
        {isEVMAdmin && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>EVM Admin:</strong> Chức năng cho Hãng sản xuất xe - Báo cáo & phân tích, quản lý cơ sở dữ liệu khách hàng và xe.
            </p>
          </div>
        )}

        {isEVMStaff && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>EVM Staff:</strong> Quản lý sản phẩm & phụ tùng - Cơ sở dữ liệu phần EV, Gắn số seri phụ tùng với xe (VIN), Quản lý chính sách bảo hành, Quản lý yêu cầu bảo hành, Chuỗi cung ứng phụ tùng bảo hành.
            </p>
          </div>
        )}

        {isSCStaff && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>SC Staff:</strong> Quản lý hồ sơ xe (Tìm kiếm theo VIN, Đăng ký VIN mới), Tạo yêu cầu bảo hành gửi lên hãng duyệt, Phân công kỹ thuật viên.
            </p>
          </div>
        )}

        {isSCTechnician && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>SC Technician:</strong> Chỉ thực hiện bảo hành - Nhận phụ tùng từ hãng, Quản lý tiến độ sửa chữa/thay thế phụ tùng, Cập nhật kết quả bảo hành và bàn giao xe.
            </p>
          </div>
        )}
      </div>

      {/* Module Content */}
      <div className="min-h-[600px]">
        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="ml-2 text-sm text-gray-500">{stat.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          <span className="text-xs text-gray-300">•</span>
                          <p className="text-xs text-gray-500">bởi {activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'customer-search' && (isEVMAdmin || isSCStaff) && <CustomerSearch />}
        {activeModule === 'warranty-management' && <WarrantyManagement userRole={user?.role} />}
        {activeModule === 'warranty-assignment' && (isEVMAdmin || isEVMStaff || isSCStaff) && <WarrantyAssignment userRole={user?.role} />}
        {activeModule === 'repair-progress' && (isEVMAdmin || isEVMStaff || isSCStaff || isSCTechnician) && <RepairProgress userRole={user?.role} />}
      </div>
    </div>
  )
}

export default HomePage