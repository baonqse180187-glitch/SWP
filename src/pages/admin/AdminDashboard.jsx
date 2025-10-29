import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  FaUsers, FaFileAlt, FaBoxOpen, FaCar, FaTools,
  FaChartLine, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaUserShield, FaBuilding, FaClipboardList, FaTachometerAlt
} from 'react-icons/fa'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from './css/AdminDashboard.module.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 128,
    totalClaims: 456,
    totalProducts: 89,
    totalVehicles: 342,
    pendingClaims: 23,
    approvedClaims: 398,
    rejectedClaims: 35,
    activeTechnicians: 15
  })

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', claims: 30, completed: 25 },
    { month: 'Feb', claims: 45, completed: 40 },
    { month: 'Mar', claims: 35, completed: 32 },
    { month: 'Apr', claims: 50, completed: 45 },
    { month: 'May', claims: 65, completed: 58 },
    { month: 'Jun', claims: 55, completed: 52 }
  ]

  const claimsByStatus = [
    { name: 'Pending', value: 23, color: '#f59e0b' },
    { name: 'Approved', value: 398, color: '#10b981' },
    { name: 'Rejected', value: 35, color: '#ef4444' }
  ]

  const recentActivities = [
    { id: 1, action: 'New warranty claim', user: 'John Doe', time: '5 phút trước', type: 'claim' },
    { id: 2, action: 'User registered', user: 'Jane Smith', time: '15 phút trước', type: 'user' },
    { id: 3, action: 'Product added', user: 'Admin', time: '30 phút trước', type: 'product' },
    { id: 4, action: 'Claim approved', user: 'EVM Staff', time: '1 giờ trước', type: 'approval' },
    { id: 5, action: 'Technician assigned', user: 'SC Staff', time: '2 giờ trước', type: 'assignment' }
  ]

  const statCards = [
    {
      title: 'Tổng Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Yêu cầu bảo hành',
      value: stats.totalClaims,
      icon: FaFileAlt,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Sản phẩm',
      value: stats.totalProducts,
      icon: FaBoxOpen,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Xe đăng ký',
      value: stats.totalVehicles,
      icon: FaCar,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'increase'
    }
  ]

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1>
              <FaTachometerAlt />
              Admin Dashboard
            </h1>
            <p>Chào mừng trở lại, {user?.fullName || 'Admin'}!</p>
          </div>
          <div className={styles.headerRight}>
            <p>Hôm nay</p>
            <p>{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard} style={{ color: card.color === 'bg-blue-500' ? '#3b82f6' : card.color === 'bg-green-500' ? '#10b981' : card.color === 'bg-purple-500' ? '#a855f7' : '#f97316' }}>
            <div className={styles.statCardHeader}>
              <div className={styles.statIcon} style={{ background: card.color === 'bg-blue-500' ? '#3b82f6' : card.color === 'bg-green-500' ? '#10b981' : card.color === 'bg-purple-500' ? '#a855f7' : '#f97316' }}>
                <card.icon />
              </div>
              <span className={styles.statChange}>
                {card.change}
              </span>
            </div>
            <h3 className={styles.statTitle}>{card.title}</h3>
            <p className={styles.statValue}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        {/* Area Chart - Claims Trend */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            <FaChartLine />
            Xu hướng yêu cầu bảo hành
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id='colorClaims' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#14b8a6' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#14b8a6' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='colorCompleted' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type='monotone' dataKey='claims' stroke='#14b8a6' fillOpacity={1} fill='url(#colorClaims)' name='Yêu cầu' />
              <Area type='monotone' dataKey='completed' stroke='#10b981' fillOpacity={1} fill='url(#colorCompleted)' name='Hoàn thành' />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Claims by Status */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            <FaClipboardList />
            Trạng thái yêu cầu
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={claimsByStatus}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
              >
                {claimsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

