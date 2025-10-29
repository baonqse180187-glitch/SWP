import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTachometerAlt, FaClipboardList, FaBoxOpen, FaBullhorn,
  FaCheckCircle, FaClock, FaTimes, FaExclamationTriangle,
  FaChartLine, FaTools
} from 'react-icons/fa';
import { warrantyClaimAPI, campaignAPI, partAPI, reportAPI } from '../../api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './css/EVMDashboard.module.css';

const EVMDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    activeCampaigns: 0,
    totalParts: 0,
    lowStockParts: 0,
    totalProducts: 0
  });
  const [recentClaims, setRecentClaims] = useState([]);
  const [claimTrends, setClaimTrends] = useState([]);
  const [campaignStats, setCampaignStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch warranty claims
      const claimsRes = await warrantyClaimAPI.getClaims({ pageSize: 5 });
      setRecentClaims(claimsRes.data.result?.content || []);

      // Fetch campaigns
      const campaignsRes = await campaignAPI.getCampaigns();
      const campaigns = campaignsRes.data.result?.content || [];

      // Fetch parts
      const partsRes = await partAPI.getParts();
      const parts = partsRes.data.result?.content || [];

      // Calculate stats
      const pendingCount = (claimsRes.data.result?.content || []).filter(c => c.status === 'PENDING').length;
      const approvedCount = (claimsRes.data.result?.content || []).filter(c => c.status === 'APPROVED').length;
      const rejectedCount = (claimsRes.data.result?.content || []).filter(c => c.status === 'REJECTED').length;
      const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
      const lowStockParts = parts.filter(p => p.stockQuantity < 10).length;

      setStats({
        totalClaims: claimsRes.data.result?.totalElements || 0,
        pendingClaims: pendingCount,
        approvedClaims: approvedCount,
        rejectedClaims: rejectedCount,
        activeCampaigns,
        totalParts: parts.length,
        lowStockParts,
        totalProducts: 0
      });

      // Mock trend data
      setClaimTrends([
        { month: 'T1', claims: 45, approved: 40 },
        { month: 'T2', claims: 52, approved: 48 },
        { month: 'T3', claims: 48, approved: 45 },
        { month: 'T4', claims: 61, approved: 56 },
        { month: 'T5', claims: 55, approved: 52 },
        { month: 'T6', claims: 67, approved: 63 }
      ]);

      setCampaignStats([
        { name: 'Active', value: activeCampaigns, color: '#10b981' },
        { name: 'Completed', value: campaigns.filter(c => c.status === 'COMPLETED').length, color: '#3b82f6' },
        { name: 'Pending', value: campaigns.filter(c => c.status === 'PENDING').length, color: '#f59e0b' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      // Mock data fallback
      setStats({
        totalClaims: 156,
        pendingClaims: 23,
        approvedClaims: 118,
        rejectedClaims: 15,
        activeCampaigns: 8,
        totalParts: 245,
        lowStockParts: 12,
        totalProducts: 45
      });

      setRecentClaims([
        {
          id: 1,
          claimNumber: 'CLM-2024-001',
          customer: { fullName: 'Nguyễn Văn A' },
          vehicle: { model: 'EV Model X', vin: 'VIN123' },
          status: 'PENDING',
          createdDate: new Date().toISOString()
        }
      ]);

      setClaimTrends([
        { month: 'T1', claims: 45, approved: 40 },
        { month: 'T2', claims: 52, approved: 48 },
        { month: 'T3', claims: 48, approved: 45 },
        { month: 'T4', claims: 61, approved: 56 },
        { month: 'T5', claims: 55, approved: 52 },
        { month: 'T6', claims: 67, approved: 63 }
      ]);

      setCampaignStats([
        { name: 'Active', value: 8, color: '#10b981' },
        { name: 'Completed', value: 15, color: '#3b82f6' },
        { name: 'Pending', value: 5, color: '#f59e0b' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { label: 'Chờ duyệt', className: styles.statusPending, icon: FaClock },
      APPROVED: { label: 'Đã duyệt', className: styles.statusApproved, icon: FaCheckCircle },
      REJECTED: { label: 'Từ chối', className: styles.statusRejected, icon: FaTimes },
      IN_PROGRESS: { label: 'Đang xử lý', className: styles.statusInProgress, icon: FaExclamationTriangle },
      COMPLETED: { label: 'Hoàn thành', className: styles.statusCompleted, icon: FaCheckCircle }
    };
    const { label, className, icon: Icon } = config[status] || config.PENDING;
    return <span className={`${styles.statusBadge} ${className}`}><Icon /> {label}</span>;
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1>
              <FaTachometerAlt />
              EVM Staff Dashboard
            </h1>
            <p>Chào mừng, {user?.fullName || 'EVM Staff'}!</p>
          </div>
          <div className={styles.headerRight}>
            <p>Hôm nay</p>
            <p>{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
            <FaClock style={{ color: '#f59e0b' }} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.pendingClaims}</h3>
            <p>Chờ phê duyệt</p>
          </div>
        </div>

        <div className={styles.statCard} style={{ borderLeft: '4px solid #10b981' }}>
          <div className={styles.statIcon} style={{ background: '#d1fae5' }}>
            <FaCheckCircle style={{ color: '#10b981' }} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.approvedClaims}</h3>
            <p>Đã phê duyệt</p>
          </div>
        </div>

        <div className={styles.statCard} style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
            <FaBullhorn style={{ color: '#3b82f6' }} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.activeCampaigns}</h3>
            <p>Chiến dịch đang chạy</p>
          </div>
        </div>

        <div className={styles.statCard} style={{ borderLeft: '4px solid #ef4444' }}>
          <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
            <FaTools style={{ color: '#ef4444' }} />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.lowStockParts}</h3>
            <p>Phụ tùng sắp hết</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        {/* Claim Trends Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            <FaChartLine />
            Xu hướng yêu cầu bảo hành
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={claimTrends}>
              <defs>
                <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="claims" stroke="#14b8a6" fillOpacity={1} fill="url(#colorClaims)" name="Yêu cầu" />
              <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={1} fill="url(#colorApproved)" name="Đã duyệt" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Stats Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            <FaBullhorn />
            Thống kê chiến dịch
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={campaignStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {campaignStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className={styles.tableCard}>
        <h2 className={styles.tableTitle}>
          <FaClipboardList />
          Yêu cầu bảo hành gần đây
        </h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Claim</th>
                <th>Khách hàng</th>
                <th>Xe</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                recentClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td className={styles.claimNumber}>{claim.claimNumber}</td>
                    <td>{claim.customer?.fullName}</td>
                    <td>
                      <div>{claim.vehicle?.model}</div>
                      <small>{claim.vehicle?.vin}</small>
                    </td>
                    <td>{new Date(claim.createdDate).toLocaleDateString('vi-VN')}</td>
                    <td>{getStatusBadge(claim.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EVMDashboard;
