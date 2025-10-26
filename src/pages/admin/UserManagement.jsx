import { useState, useEffect } from 'react';
import {
    FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter,
    FaUserShield, FaUserCog, FaUserTie, FaTools
} from 'react-icons/fa';
import { userAPI, serviceCenterAPI } from '../../api';
import styles from './UserManagement.module.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [serviceCenters, setServiceCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        phone: '',
        roleId: 4,
        serviceCenterId: null,
        address: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchServiceCenters();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = roleFilter !== 'ALL' ? { role: roleFilter } : {};
            const response = await userAPI.getUsers(params);
            setUsers(response.data.result?.content || []);
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            // Mock data
            setUsers([
                { id: 1, username: 'admin', fullName: 'System Admin', email: 'admin@evhub.com', role: 'ADMIN', createdDate: '2024-01-01' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceCenters = async () => {
        try {
            const response = await serviceCenterAPI.getServiceCenters();
            console.log('Service Centers API Response:', response.data);

            // Try different possible response structures
            let centers = response.data.result?.content
                || response.data.result
                || response.data
                || [];

            // Map serviceCenterID to id if needed
            centers = centers.map(sc => ({
                id: sc.id || sc.serviceCenterID,
                name: sc.name,
                address: sc.address,
                phone: sc.phone,
                email: sc.email
            }));

            console.log('Parsed service centers:', centers);
            setServiceCenters(centers);
        } catch (error) {
            console.error('Error fetching service centers:', error);
            setServiceCenters([]);
        }
    };

    const getRoleIcon = (role) => {
        const icons = {
            ADMIN: <FaUserShield />,
            EVM_STAFF: <FaUserCog />,
            SC_STAFF: <FaUserTie />,
            SC_TECHNICIAN: <FaTools />
        };
        return icons[role] || <FaUsers />;
    };

    const getRoleBadge = (role) => {
        const config = {
            ADMIN: { label: 'Admin', className: styles.roleAdmin },
            EVM_STAFF: { label: 'EVM Staff', className: styles.roleEVM_Staff },
            SC_STAFF: { label: 'SC Staff', className: styles.roleSC_Staff },
            SC_TECHNICIAN: { label: 'Technician', className: styles.roleTechnician }
        };
        const { label, className } = config[role] || config.ADMIN;
        return <span className={`${styles.roleBadge} ${className}`}>{getRoleIcon(role)} {label}</span>;
    };

    // Map role string to roleId
    const getRoleId = (roleString) => {
        const roleMap = {
            'ADMIN': 1,
            'EVM_STAFF': 2,
            'SC_STAFF': 4,
            'SC_TECHNICIAN': 3
        };
        return roleMap[roleString] || 4;
    };

    // Map roleId to role string
    const getRoleString = (roleId) => {
        const roleMap = {
            1: 'ADMIN',
            2: 'EVM_STAFF',
            3: 'SC_TECHNICIAN',
            4: 'SC_STAFF'
        };
        return roleMap[roleId] || 'SC_STAFF';
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        setSelectedUser(user);
        if (mode === 'edit' && user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                fullName: user.fullName || '',
                password: '',
                phone: user.phone || user.phoneNumber || '',
                roleId: getRoleId(user.role),
                serviceCenterId: user.serviceCenter?.id || null,
                address: user.address || ''
            });
        } else {
            setFormData({
                username: '',
                email: '',
                fullName: '',
                password: '',
                phone: '',
                roleId: 4, // SC_STAFF
                serviceCenterId: null,
                address: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
            username: '',
            email: '',
            fullName: '',
            password: '',
            phone: '',
            roleId: 4,
            serviceCenterId: null,
            address: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Prepare data theo UserRegisterRequest format
            const userData = {
                username: formData.username.trim(),
                password: formData.password,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone?.trim() || null,
                roleId: formData.roleId,
                serviceCenterId: [3, 4].includes(formData.roleId) && formData.serviceCenterId
                    ? parseInt(formData.serviceCenterId)
                    : null
            };

            if (modalMode === 'create') {
                // Validate password format
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
                if (!passwordRegex.test(userData.password)) {
                    alert('❌ Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số!');
                    return;
                }

                // Validate phone format (10-11 digits)
                if (userData.phone && !/^[0-9]{10,11}$/.test(userData.phone)) {
                    alert('❌ Số điện thoại phải có 10-11 chữ số!');
                    return;
                }

                // Validate service center for SC roles
                if ([3, 4].includes(userData.roleId) && !userData.serviceCenterId) {
                    alert('❌ Vui lòng chọn Service Center cho SC Staff/Technician!');
                    return;
                }

                console.log('Creating user with data:', userData);
                await userAPI.createUser(userData);
                alert('Tạo user thành công!');
            } else {
                // For update, remove password if empty
                if (!userData.password) {
                    delete userData.password;
                }
                await userAPI.updateUser(selectedUser.id, userData);
                alert('Cập nhật user thành công!');
            }

            handleCloseModal();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert('Có lỗi xảy ra: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;

        try {
            setLoading(true);
            await userAPI.deleteUser(userId);
            alert('Xóa user thành công!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Không thể xóa user: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const roleFilters = [
        { key: 'ALL', label: 'Tất cả', count: users.length },
        { key: 'ADMIN', label: 'Admin', count: users.filter(u => u.role === 'ADMIN').length },
        { key: 'EVM_STAFF', label: 'EVM Staff', count: users.filter(u => u.role === 'EVM_STAFF').length },
        { key: 'SC_STAFF', label: 'SC Staff', count: users.filter(u => u.role === 'SC_STAFF').length },
        { key: 'SC_TECHNICIAN', label: 'Technician', count: users.filter(u => u.role === 'SC_TECHNICIAN').length },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Quản lý Users
                    </h1>
                    <p className={styles.subtitle}>
                        Quản lý tài khoản và phân quyền người dùng
                    </p>
                </div>
                <button onClick={() => handleOpenModal('create')} className={styles.createButton}>
                    <FaPlus /> Tạo User
                </button>
            </div>

            {/* Search and Filters */}
            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo username, tên, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.filters}>
                    {roleFilters.map(filter => (
                        <button
                            key={filter.key}
                            className={`${styles.filterButton} ${roleFilter === filter.key ? styles.active : ''}`}
                            onClick={() => setRoleFilter(filter.key)}
                        >
                            {filter.label}
                            <span className={styles.filterCount}>{filter.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Service Center</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className={styles.emptyRow}>
                                        Không tìm thấy user nào
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <span className={styles.username}>{user.username}</span>
                                        </td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>{user.serviceCenter?.name || '-'}</td>
                                        <td>{new Date(user.createdDate).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => handleOpenModal('edit', user)}
                                                    className={styles.btnEdit}
                                                    title="Chỉnh sửa"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className={styles.btnDelete}
                                                    title="Xóa"
                                                    disabled={user.role === 'ADMIN'}
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

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{modalMode === 'create' ? 'Tạo User Mới' : 'Chỉnh sửa User'}</h2>
                            <button onClick={handleCloseModal} className={styles.btnClose}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalBody}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Username <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                        disabled={modalMode === 'edit'}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>
                                        Email
                                        <span className={styles.required}>
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    Họ và tên
                                    <span className={styles.required}>
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            {modalMode === 'create' && (
                                <div className={styles.formGroup}>
                                    <label>Mật khẩu <span className={styles.required}>*</span></label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        placeholder="Ít nhất 6 ký tự, có chữ và số"
                                    />
                                    <small style={{ color: '#64748b', fontSize: '12px' }}>
                                        Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số
                                    </small>
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Role <span className={styles.required}>*</span></label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                                        required
                                    >
                                        <option value={1}>Admin</option>
                                        <option value={2}>EVM Staff</option>
                                        <option value={4}>SC Staff</option>
                                        <option value={3}>SC Technician</option>
                                    </select>
                                </div>

                                {[3, 4].includes(formData.roleId) && (
                                    <div className={styles.formGroup}>
                                        <label>Service Center <span className={styles.required}>*</span></label>
                                        <select
                                            value={formData.serviceCenterId}
                                            onChange={(e) => setFormData({ ...formData, serviceCenterId: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Chọn Service Center --</option>
                                            {serviceCenters.map(sc => (
                                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="10-11 chữ số"
                                    pattern="[0-9]{10,11}"
                                />
                                <small style={{ color: '#64748b', fontSize: '12px' }}>
                                    Định dạng: 10-11 chữ số (VD: 0912345678)
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Địa chỉ</label>
                                <textarea
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={handleCloseModal} className={styles.btnCancel}>
                                    Hủy
                                </button>
                                <button type="submit" className={styles.btnSubmit} disabled={loading}>
                                    {loading ? 'Đang lưu...' : modalMode === 'create' ? 'Tạo User' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
