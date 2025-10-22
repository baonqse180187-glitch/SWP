import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNavigationItems } from './navigationConfig';
import { useDropdown } from './useDropdown';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';
import UserDropdown from './UserDropdown';
import ConfirmModal from '../common/ConfirmModal';
import './Sidebar.css';

const Sidebar = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    navigate = (path) => window.location.href = path;
  }

  const { user, logout, hasRole } = useAuth();
  const userDropdown = useDropdown();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    userDropdown.updatePosition(true);
  }, [userDropdown.isOpen]);

  const handleLogout = async () => {
    console.log('handleLogout called');
    try {
      await logout();
      console.log('Logout successful, navigating to /login');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = getNavigationItems(hasRole);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <div className="sidebar">
      <SidebarHeader user={user} />

      <SidebarNav navItems={navItems} currentPath={currentPath} navigate={navigate} />

      <SidebarFooter
        user={user}
        buttonRef={userDropdown.buttonRef}
        dropdownOpen={userDropdown.isOpen}
        setDropdownOpen={userDropdown.setIsOpen}
      />

      {userDropdown.isOpen && (
        <UserDropdown
          user={user}
          dropdownRef={userDropdown.dropdownRef}
          dropdownPosition={userDropdown.position}
          setDropdownOpen={userDropdown.setIsOpen}
          navigate={navigate}
          onLogoutClick={() => setShowLogoutModal(true)}
        />
      )}

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          userDropdown.setIsOpen(false);
          handleLogout();
        }}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
      />
    </div>
  );
};

export default Sidebar;