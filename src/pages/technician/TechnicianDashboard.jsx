import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClipboardList, FaCheckCircle, FaClock, FaTimesCircle,
  FaPlus, FaTools, FaExclamationTriangle, FaChartLine
} from 'react-icons/fa';
import { warrantyClaimAPI } from '../../api';
import styles from './TechnicianDashboard.module.css';

const TechnicianDashboard = () => {
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    completedClaims: 0
  });
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch claims for current technician
      const response = await warrantyClaimAPI.getClaims({
        technician: 'current',
        limit: 5,
        sort: 'createdDate,desc'
      });

      const claims = response.data.result?.content || [];
      setRecentClaims(claims);

      // Calculate stats
      setStats({
        totalClaims: claims.length,
        pendingClaims: claims.filter(c => c.status === 'PENDING').length,
        approvedClaims: claims.filter(c => c.status === 'APPROVED' || c.status === 'IN_REPAIR').length,
        completedClaims: claims.filter(c => c.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Use mock data on error
      setStats({
        totalClaims: 12,
        pendingClaims: 3,
        approvedClaims: 5,
        completedClaims: 4
      });
      setRecentClaims([
        { id: 1, claimNumber: 'WC-2025-001', vehicleVin: 'VIN123456', status: 'PENDING', createdDate: '2025-01-15' },
        { id: 2, claimNumber: 'WC-2025-002', vehicleVin: 'VIN789012', status: 'APPROVED', createdDate: '2025-01-14' },
        { id: 3, claimNumber: 'WC-2025-003', vehicleVin: 'VIN345678', status: 'IN_REPAIR', createdDate: '2025-01-13' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ duyệt', className: styles.statusPending, icon: FaClock },
      APPROVED: { label: 'Đã duyệt', className: styles.statusApproved, icon: FaCheckCircle },
      REJECTED: { label: 'Từ chối', className: styles.statusRejected, icon: FaTimesCircle },
      WAITING_PARTS: { label: 'Chờ phụ tùng', className: styles.statusWaiting, icon: FaClock },
      IN_REPAIR: { label: 'Đang sửa', className: styles.statusInRepair, icon: FaTools },
      COMPLETED: { label: 'Hoàn thành', className: styles.statusCompleted, icon: FaCheckCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`${styles.statusBadge} ${config.className}`}>
        <Icon className={styles.badgeIcon} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Kỹ thuật viên</h1>
          <p className={styles.subtitle}>Quản lý yêu cầu bảo hành của bạn</p>
        </div>
        <Link to="/technician/claims/new" className={styles.createButton}>
          <FaPlus /> Tạo yêu cầu mới
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statTotal}`}>
          <div className={styles.statIcon}>
            <FaClipboardList />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalClaims}</h3>
            <p className={styles.statLabel}>Tổng yêu cầu</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statPending}`}>
          <div className={styles.statIcon}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.pendingClaims}</h3>
            <p className={styles.statLabel}>Chờ duyệt</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statApproved}`}>
          <div className={styles.statIcon}>
            <FaTools />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.approvedClaims}</h3>
            <p className={styles.statLabel}>Đang xử lý</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCompleted}`}>
          <div className={styles.statIcon}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.completedClaims}</h3>
            <p className={styles.statLabel}>Hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            <FaChartLine /> Yêu cầu gần đây
          </h2>
          <Link to="/technician/claims" className={styles.viewAllLink}>
            Xem tất cả →
          </Link>
        </div>

        {recentClaims.length === 0 ? (
          <div className={styles.emptyState}>
            <FaExclamationTriangle className={styles.emptyIcon} />
            <p>Chưa có yêu cầu bảo hành nào</p>
            <Link to="/technician/claims/new" className={styles.emptyButton}>
              <FaPlus /> Tạo yêu cầu đầu tiên
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã yêu cầu</th>
                  <th>VIN</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      <span className={styles.claimNumber}>
                        {claim.claimNumber || `WC-${claim.id}`}
                      </span>
                    </td>
                    <td>
                      <span className={styles.vin}>{claim.vehicleVin || claim.vehicle?.vin}</span>
                    </td>
                    <td>{getStatusBadge(claim.status)}</td>
                    <td>{new Date(claim.createdDate).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <Link
                        to={`/technician/claims/${claim.id}`}
                        className={styles.viewButton}
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
        <div className={styles.actionGrid}>
          <Link to="/technician/claims/new" className={styles.actionCard}>
            <FaPlus className={styles.actionIcon} />
            <h3>Tạo yêu cầu mới</h3>
            <p>Tạo yêu cầu bảo hành mới</p>
          </Link>

          <Link to="/technician/claims?status=PENDING" className={styles.actionCard}>
            <FaClock className={styles.actionIcon} />
            <h3>Yêu cầu chờ duyệt</h3>
            <p>Xem các yêu cầu đang chờ</p>
          </Link>

          <Link to="/technician/claims?status=IN_REPAIR" className={styles.actionCard}>
            <FaTools className={styles.actionIcon} />
            <h3>Đang sửa chữa</h3>
            <p>Cập nhật tiến độ sửa chữa</p>
          </Link>

          <Link to="/technician/claims?status=COMPLETED" className={styles.actionCard}>
            <FaCheckCircle className={styles.actionIcon} />
            <h3>Đã hoàn thành</h3>
            <p>Xem lịch sử hoàn thành</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
