import React from 'react';

const StatsCard = ({ icon, value, label, color = 'teal' }) => {
    return (
        <div className={`stat-card ${color}`}>
            <div className="stat-icon">
                {icon}
            </div>
            <div className="stat-content">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
};

export default StatsCard;
