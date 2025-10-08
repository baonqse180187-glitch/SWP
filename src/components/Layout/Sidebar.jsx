import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon,
} from '../Icons'

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout, isStaff, isTechnician } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/login')
    setShowLogoutConfirm(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Trang chủ',
        href: '/',
        icon: HomeIcon,
        roles: ['SC_STAFF', 'SC_TECHNICIAN', 'ADMIN']
      }
    ]

    const staffItems = [
      {
        name: 'Quản lý khách hàng',
        href: '/customer-management',
        icon: UsersIcon,
        roles: ['SC_STAFF']
      },
      {
        name: 'Tạo bảo hành',
        href: '/warranty-request',
        icon: ClipboardDocumentListIcon,
        roles: ['SC_TECHNICIAN']
      },
      {
        name: 'Phân công bảo hành',
        href: '/warranty-assignment',
        icon: UserGroupIcon,
        roles: ['SC_STAFF']
      },
      {
        name: 'Thực hiện bảo hành',
        href: '/warranty-execution',
        icon: WrenchScrewdriverIcon,
        roles: ['SC_TECHNICIAN']
      }
    ]

    return [...baseItems, ...staffItems].filter(item => 
      item.roles.includes(user?.role)
    )
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } bg-navy text-white shadow-xl`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 bg-navy border-b border-primary-700">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">OEM Center</span>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''} ${
                  collapsed ? 'justify-center px-3' : 'px-4'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={`sidebar-nav-icon ${collapsed ? 'mr-0' : ''}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        {!collapsed && (
          <div className="absolute bottom-20 left-0 right-0 px-3">
            <div className="bg-primary-800 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-primary-300 truncate">
                    {user?.role === 'SC_STAFF' ? 'Nhân viên' : 
                     user?.role === 'SC_TECHNICIAN' ? 'Kỹ thuật viên' : 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className={`sidebar-nav-item w-full hover:bg-red-600 transition-colors duration-200 ${
              collapsed ? 'justify-center px-3' : 'px-4'
            }`}
            title={collapsed ? 'Đăng xuất' : undefined}
          >
            <ArrowLeftOnRectangleIcon className={`sidebar-nav-icon ${collapsed ? 'mr-0' : ''}`} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận đăng xuất
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có chắc muốn đăng xuất không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="btn btn-secondary px-4 py-2"
              >
                Hủy
              </button>
              <button
                onClick={confirmLogout}
                className="btn btn-danger px-4 py-2"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar