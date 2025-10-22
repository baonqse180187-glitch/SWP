import React from 'react';
import StatsCard from './StatsCard';

const StatsGrid = ({ stats }) => {
    return (
        <div className="stats-grid">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                    color={stat.color}
                />
            ))}
        </div>
    );
};

// Example usage:
// const stats = [
//   { icon: '📊', value: '1,247', label: 'Tổng yêu cầu', color: 'teal' },
//   { icon: '💰', value: '2.450.000.000 đ', label: 'Tổng chi phí', color: 'orange' },
//   { icon: '📅', value: '4.5 ngày', label: 'Thời gian xử lý TB', color: 'blue' },
//   { icon: '⚠️', value: '3.2%', label: 'Tỷ lệ hỏng hóc', color: 'red' }
// ];
// <StatsGrid stats={stats} />

export default StatsGrid;
