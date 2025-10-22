import React from 'react';
import { createPortal } from 'react-dom';

const UserDropdown = ({
    user,
    dropdownRef,
    dropdownPosition,
    setDropdownOpen,
    navigate,
    onLogoutClick
}) => {
    return createPortal(
        <div
            ref={dropdownRef}
            style={{
                position: 'fixed',
                bottom: `${dropdownPosition.bottom}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 10000
            }}
            className="dropdown-menu user-dropdown dropdown-up"
        >
            <div className="dropdown-header user-header">
                <div className="user-profile">
                    <div className="profile-avatar">
                        {user?.name?.[0] || user?.email?.[0] || 'A'}
                    </div>
                    <div className="profile-info">
                        <div className="profile-name">{user?.name || 'Admin'}</div>
                        <div className="profile-email">
                            {typeof user?.email === 'string' ? user.email : user?.username || 'user@example.com'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="dropdown-body">
                <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="dropdown-item"
                >
                    <span className="item-text">Thông tin cá nhân</span>
                </button>
                <button
                    onClick={() => { setDropdownOpen(false); navigate('/change-password'); }}
                    className="dropdown-item"
                >
                    <span className="item-text">Đổi mật khẩu</span>
                </button>
                <div className="dropdown-divider"></div>
                <button
                    onClick={onLogoutClick}
                    className="dropdown-item logout-item"
                >
                    <span className="item-text">Đăng xuất</span>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default UserDropdown;
