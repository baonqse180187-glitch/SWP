import React from 'react';
import { useLocation } from 'react-router-dom';
import './MainContent.css';

const MainContent = ({ children }) => {
    let location;
    try {
        location = useLocation();
    } catch (error) {
        location = { pathname: window.location.pathname };
    }

    // Generate breadcrumb from current path
    const generateBreadcrumb = () => {
        const paths = location.pathname.split('/').filter(Boolean);

        return paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return (
                <React.Fragment key={`${path}-${index}`}>
                    <span className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                        {label}
                    </span>
                    {!isLast && <span className="breadcrumb-separator">›</span>}
                </React.Fragment>
            );
        });
    };

    return (
        <div className="main-content">
            {/* Breadcrumb Navigation */}
            {location.pathname !== '/' && (
                <div className="breadcrumb-container">
                    <nav className="breadcrumb">
                        <span className="breadcrumb-item home">
                            <span className="home-icon">🏠</span>
                            Home
                        </span>
                        {location.pathname !== '/' && (
                            <>
                                <span className="breadcrumb-separator">›</span>
                                {generateBreadcrumb()}
                            </>
                        )}
                    </nav>
                </div>
            )}

            {/* Main Content Body */}
            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
};

export default MainContent;