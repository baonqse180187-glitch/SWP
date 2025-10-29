import { useState, useEffect } from 'react';
import {
    FaBoxOpen, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter,
    FaCar, FaTools, FaSave, FaTimes, FaImage
} from 'react-icons/fa';
import { productAPI, vehicleAPI, partAPI } from '../../api';
import ConfirmModal from '../../components/common/ConfirmModal';
import styles from './css/ProductManagement.module.css';

const ProductManagement = () => {
    const [activeTab, setActiveTab] = useState('vehicles'); // vehicles, parts
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form data cho Vehicle
    const [vehicleForm, setVehicleForm] = useState({
        vin: '',
        model: '',
        manufacturer: '',
        year: '',
        color: '',
        engineNumber: '',
        batteryCapacity: '',
        warrantyStartDate: '',
        warrantyEndDate: '',
        mileage: 0
    });

    // Form data cho Part
    const [partForm, setPartForm] = useState({
        partNumber: '',
        name: '',
        description: '',
        manufacturer: '',
        price: 0,
        stockQuantity: 0,
        warrantyPeriod: 12,
        partTypeId: 1
    });

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            if (activeTab === 'vehicles') {
                const response = await vehicleAPI.getVehicles();
                setItems(response.data.result?.content || []);
            } else {
                const response = await partAPI.getParts();
                setItems(response.data.result?.content || []);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, item = null) => {
        setModalMode(mode);
        setSelectedItem(item);

        if (mode === 'edit' && item) {
            if (activeTab === 'vehicles') {
                setVehicleForm({
                    vin: item.vin || '',
                    model: item.model || '',
                    manufacturer: item.manufacturer || '',
                    year: item.year || '',
                    color: item.color || '',
                    engineNumber: item.engineNumber || '',
                    batteryCapacity: item.batteryCapacity || '',
                    warrantyStartDate: item.warrantyStartDate || '',
                    warrantyEndDate: item.warrantyEndDate || '',
                    mileage: item.mileage || 0
                });
            } else {
                setPartForm({
                    partNumber: item.partNumber || '',
                    name: item.name || '',
                    description: item.description || '',
                    manufacturer: item.manufacturer || '',
                    price: item.price || 0,
                    stockQuantity: item.stockQuantity || 0,
                    warrantyPeriod: item.warrantyPeriod || 12,
                    partTypeId: item.partTypeId || 1
                });
            }
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setVehicleForm({
            vin: '',
            model: '',
            manufacturer: '',
            year: '',
            color: '',
            engineNumber: '',
            batteryCapacity: '',
            warrantyStartDate: '',
            warrantyEndDate: '',
            mileage: 0
        });
        setPartForm({
            partNumber: '',
            name: '',
            description: '',
            manufacturer: '',
            price: 0,
            stockQuantity: 0,
            warrantyPeriod: 12,
            partTypeId: 1
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (activeTab === 'vehicles') {
                if (modalMode === 'create') {
                    await vehicleAPI.createVehicle(vehicleForm);
                } else {
                    await vehicleAPI.updateVehicle(selectedItem.id, vehicleForm);
                }
            } else {
                if (modalMode === 'create') {
                    await partAPI.createPart(partForm);
                } else {
                    await partAPI.updatePart(selectedItem.id, partForm);
                }
            }

            alert(`✅ ${modalMode === 'create' ? 'Thêm' : 'Cập nhật'} thành công!`);
            setShowModal(false);
            fetchItems();
            resetForm();
        } catch (error) {
            console.error('Error saving item:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể lưu!'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            if (activeTab === 'vehicles') {
                await vehicleAPI.deleteVehicle(itemToDelete.id);
            } else {
                await partAPI.deletePart(itemToDelete.id);
            }
            alert('✅ Xóa thành công!');
            setShowDeleteModal(false);
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert(`❌ Lỗi: ${error.response?.data?.message || 'Không thể xóa!'}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item => {
        const search = searchTerm.toLowerCase();
        if (activeTab === 'vehicles') {
            return item.model?.toLowerCase().includes(search) ||
                item.vin?.toLowerCase().includes(search) ||
                item.manufacturer?.toLowerCase().includes(search);
        } else {
            return item.name?.toLowerCase().includes(search) ||
                item.partNumber?.toLowerCase().includes(search) ||
                item.manufacturer?.toLowerCase().includes(search);
        }
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <FaBoxOpen /> Quản lý Sản phẩm
                    </h1>
                    <p className={styles.subtitle}>Quản lý xe điện và phụ tùng</p>
                </div>
                <button onClick={() => handleOpenModal('create')} className={styles.addButton}>
                    <FaPlus /> Thêm {activeTab === 'vehicles' ? 'Xe' : 'Phụ tùng'}
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'vehicles' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('vehicles')}
                >
                    <FaCar /> Xe điện
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'parts' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('parts')}
                >
                    <FaTools /> Phụ tùng
                </button>
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder={`Tìm ${activeTab === 'vehicles' ? 'xe' : 'phụ tùng'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {activeTab === 'vehicles' ? (
                                    <>
                                        <th>VIN</th>
                                        <th>Model</th>
                                        <th>Hãng sản xuất</th>
                                        <th>Năm</th>
                                        <th>Màu</th>
                                        <th>Bảo hành</th>
                                        <th>Thao tác</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Mã PT</th>
                                        <th>Tên phụ tùng</th>
                                        <th>Hãng SX</th>
                                        <th>Giá</th>
                                        <th>Tồn kho</th>
                                        <th>BH (tháng)</th>
                                        <th>Thao tác</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.noData}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id}>
                                        {activeTab === 'vehicles' ? (
                                            <>
                                                <td>{item.vin}</td>
                                                <td>{item.model}</td>
                                                <td>{item.manufacturer}</td>
                                                <td>{item.year}</td>
                                                <td>{item.color}</td>
                                                <td>
                                                    {item.warrantyStartDate && item.warrantyEndDate ? (
                                                        `${new Date(item.warrantyStartDate).toLocaleDateString('vi-VN')} - ${new Date(item.warrantyEndDate).toLocaleDateString('vi-VN')}`
                                                    ) : 'N/A'}
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button
                                                            onClick={() => handleOpenModal('edit', item)}
                                                            className={styles.editButton}
                                                            title="Sửa"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setItemToDelete(item);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className={styles.deleteButton}
                                                            title="Xóa"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.partNumber}</td>
                                                <td>{item.name}</td>
                                                <td>{item.manufacturer}</td>
                                                <td>{item.price?.toLocaleString('vi-VN')} VNĐ</td>
                                                <td>{item.stockQuantity}</td>
                                                <td>{item.warrantyPeriod}</td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button
                                                            onClick={() => handleOpenModal('edit', item)}
                                                            className={styles.editButton}
                                                            title="Sửa"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setItemToDelete(item);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className={styles.deleteButton}
                                                            title="Xóa"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
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
                            <h2>{modalMode === 'create' ? 'Thêm' : 'Sửa'} {activeTab === 'vehicles' ? 'Xe' : 'Phụ tùng'}</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {activeTab === 'vehicles' ? (
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>VIN *</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.vin}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                                            required
                                            disabled={modalMode === 'edit'}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Model *</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.model}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Hãng sản xuất *</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.manufacturer}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, manufacturer: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Năm sản xuất *</label>
                                        <input
                                            type="number"
                                            value={vehicleForm.year}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                                            required
                                            min="2000"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Màu sắc</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.color}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Số động cơ</label>
                                        <input
                                            type="text"
                                            value={vehicleForm.engineNumber}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, engineNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Dung lượng pin (kWh)</label>
                                        <input
                                            type="number"
                                            value={vehicleForm.batteryCapacity}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, batteryCapacity: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Số km đã chạy</label>
                                        <input
                                            type="number"
                                            value={vehicleForm.mileage}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Ngày bắt đầu BH</label>
                                        <input
                                            type="date"
                                            value={vehicleForm.warrantyStartDate}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, warrantyStartDate: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Ngày kết thúc BH</label>
                                        <input
                                            type="date"
                                            value={vehicleForm.warrantyEndDate}
                                            onChange={(e) => setVehicleForm({ ...vehicleForm, warrantyEndDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Mã phụ tùng *</label>
                                        <input
                                            type="text"
                                            value={partForm.partNumber}
                                            onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Tên phụ tùng *</label>
                                        <input
                                            type="text"
                                            value={partForm.name}
                                            onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Hãng sản xuất *</label>
                                        <input
                                            type="text"
                                            value={partForm.manufacturer}
                                            onChange={(e) => setPartForm({ ...partForm, manufacturer: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            value={partForm.price}
                                            onChange={(e) => setPartForm({ ...partForm, price: parseFloat(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Số lượng tồn kho *</label>
                                        <input
                                            type="number"
                                            value={partForm.stockQuantity}
                                            onChange={(e) => setPartForm({ ...partForm, stockQuantity: parseInt(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Thời hạn BH (tháng) *</label>
                                        <input
                                            type="number"
                                            value={partForm.warrantyPeriod}
                                            onChange={(e) => setPartForm({ ...partForm, warrantyPeriod: parseInt(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                        <label>Mô tả</label>
                                        <textarea
                                            value={partForm.description}
                                            onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

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
                    message={`Bạn có chắc chắn muốn xóa ${activeTab === 'vehicles' ? 'xe' : 'phụ tùng'} này?`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default ProductManagement;
