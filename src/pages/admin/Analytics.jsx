import { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    FaChartLine, FaCalendarAlt, FaDownload, FaFilter,
    FaDollarSign, FaTools, FaCar, FaExclamationTriangle
} from 'react-icons/fa';
import { reportAPI } from '../../api';
import styles from './css/Analytics.module.css';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days');
    const [stats, setStats] = useState({
        totalClaims: 0,
        totalCost: 0,
        avgProcessingTime: 0,
        failureRate: 0
    });
    const [claimTrends, setClaimTrends] = useState([]);
    const [failureByPart, setFailureByPart] = useState([]);
    const [failureByModel, setFailureByModel] = useState([]);
    const [serviceCenterPerformance, setServiceCenterPerformance] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats
            const statsResponse = await reportAPI.getDashboardStats({ dateRange });
            setStats(statsResponse.data.result || {});

            // Fetch claim trends
            const trendsResponse = await reportAPI.getClaimTrends({ dateRange });
            setClaimTrends(trendsResponse.data.result || []);

            // Fetch failure rates
            const partFailureResponse = await reportAPI.getFailureRateByPart({ dateRange });
            setFailureByPart(partFailureResponse.data.result || []);

            const modelFailureResponse = await reportAPI.getFailureRateByModel({ dateRange });
            setFailureByModel(modelFailureResponse.data.result || []);

            // Mock data fallback
        } catch (error) {
            console.error('Error fetching analytics:', error);

            // Mock data
            setStats({
                totalClaims: 1247,
                totalCost: 2450000000,
                avgProcessingTime: 4.5,
                failureRate: 3.2
            });

            setClaimTrends([
                { month: 'T1', claims: 98, cost: 180000000 },
                { month: 'T2', claims: 105, cost: 195000000 },
                { month: 'T3', claims: 112, cost: 210000000 },
                { month: 'T4', claims: 95, cost: 175000000 },
                { month: 'T5', claims: 118, cost: 225000000 },
                { month: 'T6', claims: 125, cost: 240000000 },
            ]);

            setFailureByPart([
                { name: 'Pin (Battery)', value: 420, percentage: 35 },
                { name: 'Động cơ', value: 280, percentage: 23 },
                { name: 'BMS', value: 240, percentage: 20 },
                { name: 'Inverter', value: 150, percentage: 12 },
                { name: 'Bộ sạc', value: 90, percentage: 7 },
                { name: 'Khác', value: 37, percentage: 3 },
            ]);

            setFailureByModel([
                { model: 'EV Model X', failures: 145, rate: 4.2 },
                { model: 'EV Model Y', failures: 98, rate: 2.8 },
                { model: 'EV Model Z', failures: 112, rate: 3.5 },
                { model: 'EV Model S', failures: 76, rate: 2.1 },
                { model: 'EV Model T', failures: 89, rate: 2.9 },
            ]);

            setServiceCenterPerformance([
                { name: 'SC Hà Nội', completed: 245, avgTime: 3.5, satisfaction: 4.5 },
                { name: 'SC TP.HCM', completed: 312, avgTime: 4.2, satisfaction: 4.3 },
                { name: 'SC Đà Nẵng', completed: 189, avgTime: 3.8, satisfaction: 4.6 },
                { name: 'SC Hải Phòng', completed: 156, avgTime: 4.5, satisfaction: 4.2 },
                { name: 'SC Cần Thơ', completed: 142, avgTime: 4.8, satisfaction: 4.1 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const exportReport = () => {
        alert('📊 Chức năng export báo cáo đang được phát triển!');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Báo cáo & Phân tích</h1>
                    <p className={styles.subtitle}>Thống kê và phân tích dữ liệu bảo hành</p>
                </div>
                <div className={styles.headerActions}>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className={styles.dateRangeSelect}
                    >
                        <option value="7days">7 ngày qua</option>
                        <option value="30days">30 ngày qua</option>
                        <option value="90days">90 ngày qua</option>
                        <option value="1year">1 năm qua</option>
                    </select>
                    <button onClick={exportReport} className={styles.exportButton}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Key Metrics */}
                    <div className={styles.metricsGrid}>
                        <div className={`${styles.metricCard} ${styles.metric1}`}>
                            <div className={styles.metricIcon}>
                                <FaChartLine />
                            </div>
                            <div className={styles.metricContent}>
                                <h3>{stats.totalClaims?.toLocaleString()}</h3>
                                <p>Tổng yêu cầu</p>
                            </div>
                        </div>

                        <div className={`${styles.metricCard} ${styles.metric2}`}>
                            <div className={styles.metricIcon}>
                                <FaDollarSign />
                            </div>
                            <div className={styles.metricContent}>
                                <h3>{formatCurrency(stats.totalCost)}</h3>
                                <p>Tổng chi phí</p>
                            </div>
                        </div>

                        <div className={`${styles.metricCard} ${styles.metric3}`}>
                            <div className={styles.metricIcon}>
                                <FaCalendarAlt />
                            </div>
                            <div className={styles.metricContent}>
                                <h3>{stats.avgProcessingTime} ngày</h3>
                                <p>Thời gian xử lý TB</p>
                            </div>
                        </div>

                        <div className={`${styles.metricCard} ${styles.metric4}`}>
                            <div className={styles.metricIcon}>
                                <FaExclamationTriangle />
                            </div>
                            <div className={styles.metricContent}>
                                <h3>{stats.failureRate}%</h3>
                                <p>Tỷ lệ hỏng hóc</p>
                            </div>
                        </div>
                    </div>

                    {/* Claim Trends Chart */}
                    <div className={styles.chartCard}>
                        <h2 className={styles.chartTitle}>
                            <FaChartLine /> Xu hướng yêu cầu bảo hành
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={claimTrends}>
                                <defs>
                                    <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="claims"
                                    stroke="#14b8a6"
                                    fillOpacity={1}
                                    fill="url(#colorClaims)"
                                    name="Số yêu cầu"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Charts Grid */}
                    <div className={styles.chartsGrid}>
                        {/* Failure by Part Type - Pie Chart */}
                        <div className={styles.chartCard}>
                            <h2 className={styles.chartTitle}>
                                <FaTools /> Phân bố hỏng hóc theo phụ tùng
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={failureByPart}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {failureByPart.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className={styles.legend}>
                                {failureByPart.map((item, index) => (
                                    <div key={index} className={styles.legendItem}>
                                        <span
                                            className={styles.legendColor}
                                            style={{ background: COLORS[index % COLORS.length] }}
                                        ></span>
                                        <span>{item.name}: {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Failure by Model - Bar Chart */}
                        <div className={styles.chartCard}>
                            <h2 className={styles.chartTitle}>
                                <FaCar /> Tỷ lệ hỏng hóc theo model
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={failureByModel}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="model" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="failures" fill="#14b8a6" name="Số lỗi" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
