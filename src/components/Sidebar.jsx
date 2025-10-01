import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout || (() => { });

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

  const role = user?.role || 'guest';
  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(role) || role === 'admin'
  );

  const getInitials = (name = '') => {
    return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() || 'U';
  };

  return (
    <nav className="col-md-3 col-lg-2 d-md-block sidebar bg-dark text-white px-3 py-4" style={{ minHeight: '100vh', position: 'sticky', top: 0 }}>
      <div className="sidebar-sticky">
        <div className="d-flex align-items-center mb-4">
          <div className="me-2" style={{ width: 42, height: 42 }}>
            <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: 42, height: 42 }}>
              {getInitials(user?.name || user?.username)}
            </div>
          </div>
          <div>
            <div className="fw-bold">{user?.name || user?.username || 'Người dùng'}</div>
            <small className="text-muted">{user?.role || 'guest'}</small>
          </div>
        </div>

        <ul className="nav flex-column">
          {filteredMenuItems.length > 0 ? filteredMenuItems.map(item => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) => `nav-link d-flex align-items-center text-white ${isActive ? 'bg-light bg-opacity-10 rounded' : 'text-white-75'}`}
                style={{ padding: '.5rem .75rem' }}
              >
                <i className={`${item.icon} me-2`}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          )) : (
            <li className="nav-item">
              <div className="nav-link text-muted">Không có menu</div>
            </li>
          )}

          <li className="nav-item mt-4">
            <button
              className="btn btn-outline-light w-100 text-start"
              onClick={logout}
              title="Đăng xuất"
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

