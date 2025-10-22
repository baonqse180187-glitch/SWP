import React from 'react';

const SidebarHeader = ({ user }) => {
    return (
        <div className="sidebar-header">
            <div className="app-info">
                <div className="app-icon">
                    <span>🛡️</span>
                </div>
                <div className="app-details">
                    <h3 className="app-title">Bảo Hành Pro</h3>
                    <span className="app-version">v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default SidebarHeader;
