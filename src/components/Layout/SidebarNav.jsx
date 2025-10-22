import React from 'react';

const SidebarNav = ({ navItems, currentPath, navigate }) => {
    return (
        <nav className="sidebar-nav">
            <ul className="nav-list">
                {navItems.map((item, index) => (
                    <li key={index} className="nav-item">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(item.path);
                            }}
                            className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.text}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SidebarNav;
