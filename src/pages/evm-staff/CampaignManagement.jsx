import { useState, useEffect } from 'react';
import {
    FaBullhorn, FaPlus, FaEdit, FaTrash, FaSearch,
    FaSave, FaTimes, FaEye, FaCalendarAlt, FaUsers
} from 'react-icons/fa';
import { campaignAPI } from '../../api';
import ConfirmModal from '../../components/common/ConfirmModal';
import styles from './css/CampaignManagement.module.css';

const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'PENDING',
        targetAudience: '',
        budget: 0
    });

    useEffect(() => {
        fetchCampaigns();
    }, [statusFilter]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            let response;
            if (statusFilter === 'ALL') {
                response = await campaignAPI.getCampaigns();
            } else {
                response = await campaignAPI.getCampaignsByStatus(statusFilter);
            }
            setCampaigns(response.data.result?.content || []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            // Mock data
            setCampaigns([
                {
                    id: 1,
                    name: 'Chiến dịch bảo hành mùa hè 2024',
                    description: 'Ưu đãi bảo hành miễn phí cho xe điện',
                    startDate: '2024-06-01',
                    endDate: '2024-08-31',
                    status: 'ACTIVE',
                    targetAudience: 'Tất cả khách hàng',
                    budget: 500000000
                },
                {
                    id: 2,
                    name: 'Chương trình tri ân khách hàng',
                    description: 'Giảm 20% chi phí bảo hành',
                    startDate: '2024-05-01',
                    endDate: '2024-05-31',
                    status: 'COMPLETED',
                    targetAudience: 'Khách hàng VIP',
                    budget: 300000000
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, campaign = null) => {
        setModalMode(mode);
        setSelectedCampaign(campaign);

        if (mode === 'edit' && campaign) {
            setFormData({
                name: campaign.name || '',
                description: campaign.description || '',
                startDate: campaign.startDate || '',
                endDate: campaign.endDate || '',
                status: campaign.status || 'PENDING',
                targetAudience: campaign.targetAudience || '',
                budget: campaign.budget || 0
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'PENDING',
            targetAudience: '',
            budget: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (modalMode === 'create') {
                await campaignAPI.createCampaign(formData);
            } else {
                await campaignAPI.updateCampaign(selectedCampaign.id, formData);
            }

            alert(`✅ ${modalMode === 'create' ? 'Tạo' : 'Cập nhật'} chiến dịch thành công!`);
            setShowModal(false);
            fetchCampaigns();
            resetForm();
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể lưu!'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await campaignAPI.deleteCampaign(itemToDelete.id);
            alert('✅ Xóa chiến dịch thành công!');
            setShowDeleteModal(false);
            fetchCampaigns();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể xóa!'}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PENDING: { label: 'Chờ triển khai', className: styles.statusPending },
            ACTIVE: { label: 'Đang chạy', className: styles.statusActive },
            COMPLETED: { label: 'Đã kết thúc', className: styles.statusCompleted },
            CANCELLED: { label: 'Đã hủy', className: styles.statusCancelled }
        };
        const { label, className } = config[status] || config.PENDING;
        return <span className={`${styles.statusBadge} ${className}`}>{label}</span>;
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const search = searchTerm.toLowerCase();
        return campaign.name?.toLowerCase().includes(search) ||
            campaign.description?.toLowerCase().includes(search) ||
            campaign.targetAudience?.toLowerCase().includes(search);
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <FaBullhorn /> Quản lý Chiến dịch
                    </h1>
                    <p className={styles.subtitle}>Quản lý các chiến dịch bảo hành và khuyến mãi</p>
                </div>
                <button onClick={() => handleOpenModal('create')} className={styles.addButton}>
                    <FaPlus /> Tạo chiến dịch
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm chiến dịch..."
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
                    <option value="PENDING">Chờ triển khai</option>
                    <option value="ACTIVE">Đang chạy</option>
                    <option value="COMPLETED">Đã kết thúc</option>
                    <option value="CANCELLED">Đã hủy</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Tên chiến dịch</th>
                                <th>Mô tả</th>
                                <th>Thời gian</th>
                                <th>Đối tượng</th>
                                <th>Ngân sách</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.noData}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filteredCampaigns.map((campaign) => (
                                    <tr key={campaign.id}>
                                        <td className={styles.campaignName}>{campaign.name}</td>
                                        <td className={styles.description}>
                                            {campaign.description?.substring(0, 50)}
                                            {campaign.description?.length > 50 && '...'}
                                        </td>
                                        <td>
                                            <div className={styles.dateRange}>
                                                <FaCalendarAlt />
                                                <div>
                                                    <div>{new Date(campaign.startDate).toLocaleDateString('vi-VN')}</div>
                                                    <small>đến {new Date(campaign.endDate).toLocaleDateString('vi-VN')}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.audience}>
                                                <FaUsers /> {campaign.targetAudience}
                                            </div>
                                        </td>
                                        <td className={styles.budget}>
                                            {campaign.budget?.toLocaleString('vi-VN')} VNĐ
                                        </td>
                                        <td>{getStatusBadge(campaign.status)}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleOpenModal('edit', campaign)}
                                                    className={styles.editButton}
                                                    title="Sửa"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setItemToDelete(campaign);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className={styles.deleteButton}
                                                    title="Xóa"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Create/Edit */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{modalMode === 'create' ? 'Tạo' : 'Sửa'} chiến dịch</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label>Tên chiến dịch *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label>Mô tả</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Ngày bắt đầu *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Ngày kết thúc *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Đối tượng *</label>
                                    <input
                                        type="text"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        placeholder="VD: Tất cả khách hàng, Khách hàng VIP..."
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Ngân sách (VNĐ) *</label>
                                    <input
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Trạng thái *</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="PENDING">Chờ triển khai</option>
                                        <option value="ACTIVE">Đang chạy</option>
                                        <option value="COMPLETED">Đã kết thúc</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                                    <FaTimes /> Hủy
                                </button>
                                <button type="submit" className={styles.saveButton} disabled={loading}>
                                    <FaSave /> {loading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa chiến dịch này?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default CampaignManagement;
