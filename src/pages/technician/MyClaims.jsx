import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    FaSearch, FaFilter, FaClock, FaCheckCircle,
    FaTimesCircle, FaTools, FaEye, FaPlus
} from 'react-icons/fa';
import { warrantyClaimAPI } from '../../api';
import styles from './MyClaims.module.css';

const MyClaims = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(searchParams.get('status') || 'ALL');

    useEffect(() => {
        fetchClaims();
    }, [activeFilter]);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const params = {
                technician: 'current',
                ...(activeFilter !== 'ALL' && { status: activeFilter })
            };

            const response = await warrantyClaimAPI.getClaims(params);
            setClaims(response.data.result?.content || []);
        } catch (error) {
            console.error('❌ Error fetching claims:', error);
            // Mock data
            setClaims([
                { id: 1, claimNumber: 'WC-2025-001', vehicleVin: 'VIN123456', status: 'PENDING', createdDate: '2025-01-15T10:30:00', description: 'Battery failure' },
                { id: 2, claimNumber: 'WC-2025-002', vehicleVin: 'VIN789012', status: 'APPROVED', createdDate: '2025-01-14T14:20:00', description: 'Motor issue' },
                { id: 3, claimNumber: 'WC-2025-003', vehicleVin: 'VIN345678', status: 'IN_REPAIR', createdDate: '2025-01-13T09:15:00', description: 'BMS malfunction' },
                { id: 4, claimNumber: 'WC-2025-004', vehicleVin: 'VIN901234', status: 'COMPLETED', createdDate: '2025-01-12T16:45:00', description: 'Charger port repair' },
                { id: 5, claimNumber: 'WC-2025-005', vehicleVin: 'VIN567890', status: 'REJECTED', createdDate: '2025-01-11T11:00:00', description: 'Out of warranty' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PENDING: { label: 'Chờ duyệt', className: styles.statusPending, icon: FaClock },
            APPROVED: { label: 'Đã duyệt', className: styles.statusApproved, icon: FaCheckCircle },
            REJECTED: { label: 'Từ chối', className: styles.statusRejected, icon: FaTimesCircle },
            WAITING_PARTS: { label: 'Chờ phụ tùng', className: styles.statusWaiting, icon: FaClock },
            IN_REPAIR: { label: 'Đang sửa', className: styles.statusInRepair, icon: FaTools },
            COMPLETED: { label: 'Hoàn thành', className: styles.statusCompleted, icon: FaCheckCircle }
        };

        const { label, className, icon: Icon } = config[status] || config.PENDING;
        return (
            <span className={`${styles.statusBadge} ${className}`}>
                <Icon /> {label}
            </span>
        );
    };

    const filteredClaims = claims.filter(claim => {
        const matchesSearch =
            claim.claimNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.vehicleVin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.description?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const filters = [
        { key: 'ALL', label: 'Tất cả', count: claims.length },
        { key: 'PENDING', label: 'Chờ duyệt', count: claims.filter(c => c.status === 'PENDING').length },
        { key: 'APPROVED', label: 'Đã duyệt', count: claims.filter(c => c.status === 'APPROVED').length },
        { key: 'IN_REPAIR', label: 'Đang sửa', count: claims.filter(c => c.status === 'IN_REPAIR').length },
        { key: 'COMPLETED', label: 'Hoàn thành', count: claims.filter(c => c.status === 'COMPLETED').length },
        { key: 'REJECTED', label: 'Từ chối', count: claims.filter(c => c.status === 'REJECTED').length },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Yêu cầu bảo hành của tôi</h1>
                    <p className={styles.subtitle}>Quản lý tất cả yêu cầu bảo hành</p>
                </div>
                <Link to="/technician/claims/new" className={styles.createButton}>
                    <FaPlus /> Tạo yêu cầu mới
                </Link>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã yêu cầu, VIN, mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`${styles.filterButton} ${activeFilter === filter.key ? styles.active : ''}`}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                        <span className={styles.filterCount}>{filter.count}</span>
                    </button>
                ))}
            </div>

            {/* Claims List */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : filteredClaims.length === 0 ? (
                <div className={styles.emptyState}>
                    <FaTools className={styles.emptyIcon} />
                    <h3>Không tìm thấy yêu cầu nào</h3>
                    <p>Bạn chưa có yêu cầu bảo hành nào hoặc không có kết quả phù hợp với tìm kiếm</p>
                    <Link to="/technician/claims/new" className={styles.emptyButton}>
                        <FaPlus /> Tạo yêu cầu đầu tiên
                    </Link>
                </div>
            ) : (
                <div className={styles.claimsList}>
                    {filteredClaims.map(claim => (
                        <div key={claim.id} className={styles.claimCard}>
                            <div className={styles.claimHeader}>
                                <div>
                                    <h3 className={styles.claimNumber}>{claim.claimNumber}</h3>
                                    <p className={styles.claimVin}>VIN: {claim.vehicleVin || claim.vehicle?.vin}</p>
                                </div>
                                {getStatusBadge(claim.status)}
                            </div>

                            <p className={styles.claimDescription}>
                                {claim.description || 'Không có mô tả'}
                            </p>

                            <div className={styles.claimFooter}>
                                <span className={styles.claimDate}>
                                    <FaClock /> {new Date(claim.createdDate).toLocaleDateString('vi-VN')}
                                </span>
                                <Link
                                    to={`/technician/claims/${claim.id}`}
                                    className={styles.viewButton}
                                >
                                    <FaEye /> Chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClaims;
