import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Danh sách menu, thêm menu EVM
  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', roles: ['admin', 'evm_staff', 'sc_staff', 'sc_technician'] },
    { path: '/vehicles', icon: 'fas fa-car', label: 'Quản lý xe', roles: ['admin', 'evm_staff', 'sc_staff'] },
    { path: '/claims', icon: 'fas fa-clipboard-list', label: 'Yêu cầu bảo hành', roles: ['admin', 'evm_staff', 'sc_staff', 'sc_technician'] },
    { path: '/recalls', icon: 'fas fa-bullhorn', label: 'Recall & Campaigns', roles: ['admin', 'sc_staff'] },
    { path: '/parts', icon: 'fas fa-cogs', label: 'Quản lý phụ tùng', roles: ['admin', 'sc_technician'] },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Báo cáo', roles: ['admin', 'evm_staff'] },
    { path: '/evm', icon: 'fas fa-bolt', label: 'EVM', roles: ['admin', 'evm_staff'] }
  ];

  // Lọc menu theo role
  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role) || user?.role === 'admin'
  );

  return (
    <nav className="col-md-3 col-lg-2 d-md-block sidebar px-3 py-4">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          {filteredMenuItems.map(item => (
            <li className="nav-item" key={item.path}>
              <NavLink to={item.path} className="nav-link">
                <i className={`${item.icon} me-2`}></i>{item.label}
              </NavLink>
            </li>
          ))}
          <li className="nav-item mt-4">
            <button
              className="nav-link btn btn-link text-start w-100"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              onClick={logout}
            >
              <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;

