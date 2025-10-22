import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const MainLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <MainContent>
                {children}
            </MainContent>
        </div>
    );
};

export default MainLayout;