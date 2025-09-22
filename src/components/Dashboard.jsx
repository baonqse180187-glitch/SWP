import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeClaims: 0,
    completedClaims: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    // Mock data
    setStats({
      totalVehicles: 1250,
      activeClaims: 45,
      completedClaims: 320,
      pendingApprovals: 12
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const partTypeData = {
    labels: ['Battery', 'Motor', 'BMS'],
    datasets: [
      {
        data: [1, 1, 1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 0,
      },
    ],
  };

  const costData = {
    labels: ['2024-09'],
    datasets: [
      {
        label: 'Chi phí bảo hành',
        data: [15000000],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(value);
          },
        },
      },
    },
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <h2>Vui lòng đăng nhập</h2>
          <p>Để truy cập vào bảng điều khiển, bạn cần đăng nhập với tài khoản hợp lệ.</p>
          {/* Assuming a login page path */}
          <a href="/login" className="btn btn-primary">Đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{getGreeting()}, {user?.name}!</h2>
          <p className="text-muted mb-0">Chào mừng đến với hệ thống bảo hành xe điện</p>
        </div>
        <div className="text-end">
          <small className="text-muted">Vai trò: {user?.role}</small>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalVehicles}</h4>
                  <p className="mb-0">Tổng số xe</p>
                </div>
                <i className="fas fa-car fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.activeClaims}</h4>
                  <p className="mb-0">Yêu cầu đang xử lý</p>
                </div>
                <i className="fas fa-clipboard-list fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.completedClaims}</h4>
                  <p className="mb-0">Đã hoàn thành</p>
                </div>
                <i className="fas fa-check-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.pendingApprovals}</h4>
                  <p className="mb-0">Chờ duyệt</p>
                </div>
                <i className="fas fa-clock fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Hoạt động gần đây</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Xe mới được đăng ký</h6>
                    <small className="text-muted">VIN: LVSHGAE4XJ1234567 - Model X</small>
                  </div>
                  <small className="text-muted">2 giờ trước</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Yêu cầu bảo hành mới</h6>
                    <small className="text-muted">ID: WC-20250115-001 - Pin không sạc được</small>
                  </div>
                  <small className="text-muted">4 giờ trước</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Bảo hành hoàn thành</h6>
                    <small className="text-muted">ID: WC-20250114-005 - Thay thế BMS</small>
                  </div>
                  <small className="text-muted">6 giờ trước</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Thông báo</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <small>Cập nhật chính sách bảo hành mới từ 01/02/2025</small>
              </div>
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <small>Recall Model Y - Kiểm tra hệ thống phanh</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

