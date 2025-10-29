import { useState, useEffect } from 'react';
import {
    FaClipboardList, FaSearch, FaFilter, FaEye, FaCheck, FaTimes,
    FaUser, FaCar, FaClock, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';
import { warrantyClaimAPI } from '../../api';
import ConfirmModal from '../../components/common/ConfirmModal';
import styles from './css/WarrantyApproval.module.css';

const WarrantyApproval = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchClaims();
    }, [statusFilter]);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            let response;
            if (statusFilter === 'ALL') {
                response = await warrantyClaimAPI.getClaims();
            } else {
                response = await warrantyClaimAPI.getClaimsByStatus(statusFilter);
            }
            setClaims(response.data.result?.content || []);
        } catch (error) {
            console.error('Error fetching claims:', error);
            // Mock data
            setClaims([
                {
                    id: 1,
                    claimNumber: 'CLM-2024-001',
                    customer: { fullName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
                    vehicle: { vin: 'VIN12345', model: 'EV Model X' },
                    issueDescription: 'Pin bị sụt dung lượng nhanh',
                    status: 'PENDING',
                    createdDate: '2024-01-15',
                    estimatedCost: 15000000
                },
                {
                    id: 2,
                    claimNumber: 'CLM-2024-002',
                    customer: { fullName: 'Trần Thị B', email: 'tranthib@gmail.com' },
                    vehicle: { vin: 'VIN67890', model: 'EV Model Y' },
                    issueDescription: 'Động cơ kêu lạ',
                    status: 'PENDING',
                    createdDate: '2024-01-16',
                    estimatedCost: 8000000
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClaim = async () => {
        try {
            setLoading(true);
            await warrantyClaimAPI.approveClaim(selectedClaim.id, {
                approvalNotes: 'Đã phê duyệt yêu cầu bảo hành'
            });
            alert('✅ Phê duyệt yêu cầu thành công!');
            setShowApproveModal(false);
            fetchClaims();
        } catch (error) {
            console.error('Error approving claim:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể phê duyệt!'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectClaim = async () => {
        if (!rejectReason.trim()) {
            alert('❌ Vui lòng nhập lý do từ chối!');
            return;
        }

        try {
            setLoading(true);
            await warrantyClaimAPI.rejectClaim(selectedClaim.id, rejectReason);
            alert('✅ Từ chối yêu cầu thành công!');
            setShowRejectModal(false);
            setRejectReason('');
            fetchClaims();
        } catch (error) {
            console.error('Error rejecting claim:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể từ chối!'}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PENDING: { label: 'Chờ duyệt', className: styles.statusPending, icon: FaClock },
            APPROVED: { label: 'Đã duyệt', className: styles.statusApproved, icon: FaCheckCircle },
            REJECTED: { label: 'Từ chối', className: styles.statusRejected, icon: FaTimes },
            IN_PROGRESS: { label: 'Đang xử lý', className: styles.statusInProgress, icon: FaExclamationCircle },
            COMPLETED: { label: 'Hoàn thành', className: styles.statusCompleted, icon: FaCheck }
        };
        const { label, className, icon: Icon } = config[status] || config.PENDING;
        return (
            <span className={`${styles.statusBadge} ${className}`}>
                <Icon /> {label}
            </span>
        );
    };

    const filteredClaims = claims.filter(claim => {
        const search = searchTerm.toLowerCase();
        return claim.claimNumber?.toLowerCase().includes(search) ||
            claim.customer?.fullName?.toLowerCase().includes(search) ||
            claim.vehicle?.vin?.toLowerCase().includes(search);
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <FaClipboardList /> Phê duyệt Bảo hành
                    </h1>
                    <p className={styles.subtitle}>Quản lý và phê duyệt yêu cầu bảo hành</p>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã claim, khách hàng, VIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="COMPLETED">Hoàn thành</option>
                </select>
            </div>

            {/* Statistics */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
                        <FaClock style={{ color: '#f59e0b' }} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{claims.filter(c => c.status === 'PENDING').length}</h3>
                        <p>Chờ phê duyệt</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#d1fae5' }}>
                        <FaCheckCircle style={{ color: '#10b981' }} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{claims.filter(c => c.status === 'APPROVED').length}</h3>
                        <p>Đã duyệt</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
                        <FaTimes style={{ color: '#ef4444' }} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{claims.filter(c => c.status === 'REJECTED').length}</h3>
                        <p>Từ chối</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
                        <FaExclamationCircle style={{ color: '#3b82f6' }} />
                    </div>
                    <div className={styles.statContent}>
                        <h3>{claims.filter(c => c.status === 'IN_PROGRESS').length}</h3>
                        <p>Đang xử lý</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã Claim</th>
                                <th>Khách hàng</th>
                                <th>Xe</th>
                                <th>Vấn đề</th>
                                <th>Chi phí dự kiến</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClaims.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className={styles.noData}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <tr key={claim.id}>
                                        <td className={styles.claimNumber}>{claim.claimNumber}</td>
                                        <td>
                                            <div className={styles.customerInfo}>
                                                <FaUser />
                                                <div>
                                                    <div>{claim.customer?.fullName}</div>
                                                    <small>{claim.customer?.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.vehicleInfo}>
                                                <FaCar />
                                                <div>
                                                    <div>{claim.vehicle?.model}</div>
                                                    <small>{claim.vehicle?.vin}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.issueDesc}>
                                            {claim.issueDescription?.substring(0, 50)}
                                            {claim.issueDescription?.length > 50 && '...'}
                                        </td>
                                        <td className={styles.cost}>
                                            {claim.estimatedCost?.toLocaleString('vi-VN')} VNĐ
                                        </td>
                                        <td>{new Date(claim.createdDate).toLocaleDateString('vi-VN')}</td>
                                        <td>{getStatusBadge(claim.status)}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedClaim(claim);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className={styles.viewButton}
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye />
                                                </button>
                                                {claim.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClaim(claim);
                                                                setShowApproveModal(true);
                                                            }}
                                                            className={styles.approveButton}
                                                            title="Phê duyệt"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedClaim(claim);
                                                                setShowRejectModal(true);
                                                            }}
                                                            className={styles.rejectButton}
                                                            title="Từ chối"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedClaim && (
                <div className={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Chi tiết yêu cầu bảo hành</h2>
                            <button onClick={() => setShowDetailModal(false)} className={styles.closeButton}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}>
                                    <label>Mã Claim:</label>
                                    <p>{selectedClaim.claimNumber}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Trạng thái:</label>
                                    <p>{getStatusBadge(selectedClaim.status)}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Khách hàng:</label>
                                    <p>{selectedClaim.customer?.fullName}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Email:</label>
                                    <p>{selectedClaim.customer?.email}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Model xe:</label>
                                    <p>{selectedClaim.vehicle?.model}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>VIN:</label>
                                    <p>{selectedClaim.vehicle?.vin}</p>
                                </div>
                                <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                                    <label>Mô tả vấn đề:</label>
                                    <p>{selectedClaim.issueDescription}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Chi phí dự kiến:</label>
                                    <p className={styles.cost}>{selectedClaim.estimatedCost?.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Ngày tạo:</label>
                                    <p>{new Date(selectedClaim.createdDate).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && (
                <ConfirmModal
                    title="Xác nhận phê duyệt"
                    message={`Bạn có chắc chắn muốn phê duyệt yêu cầu ${selectedClaim?.claimNumber}?`}
                    onConfirm={handleApproveClaim}
                    onCancel={() => setShowApproveModal(false)}
                    confirmText="Phê duyệt"
                    confirmColor="#10b981"
                />
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Từ chối yêu cầu bảo hành</h2>
                            <button onClick={() => setShowRejectModal(false)} className={styles.closeButton}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Lý do từ chối *</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    placeholder="Nhập lý do từ chối yêu cầu bảo hành..."
                                    className={styles.textarea}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowRejectModal(false)} className={styles.cancelButton}>
                                Hủy
                            </button>
                            <button onClick={handleRejectClaim} className={styles.rejectButtonMain} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarrantyApproval;
