import React from 'react';

const SidebarFooter = ({ user, buttonRef, dropdownOpen, setDropdownOpen }) => {
    return (
        <div className="sidebar-footer">
            <button
                ref={buttonRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="user-btn"
            >
                <div className="user-avatar">
                    {user?.name?.[0] || user?.email?.[0] || 'A'}
                </div>
                <div className="user-info">
                    <div className="user-display-name">{user?.name || 'admin'}</div>
                    <div className="user-role">
                        {typeof user?.role === 'string' ? user.role : user?.role?.name || 'Administrator'}
                    </div>
                </div>
                <svg
                    className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                </svg>
            </button>
        </div>
    );
};

export default SidebarFooter;
