import { ROLES } from '../../utils/constants';

export const getNavigationItems = (hasRole) => {
    if (hasRole(ROLES.ADMIN)) {
        return [
            { icon: '📊', text: 'Dashboard', path: '/admin/dashboard' },
            { icon: '👥', text: 'Quản Lý Users', path: '/admin/users' },
            { icon: '📈', text: 'Báo Cáo & Phân Tích', path: '/admin/analytics' },
            { icon: '🔧', text: 'Cài Đặt', path: '/admin/settings' },
        ];
    }

    if (hasRole(ROLES.EVM_STAFF)) {
        return [
            { icon: '📊', text: 'Dashboard', path: '/evm/dashboard' },
            { icon: '📦', text: 'Quản Lý Sản Phẩm', path: '/evm/products' },
            { icon: '🔩', text: 'Quản Lý Phụ Tùng', path: '/evm/parts' },
            { icon: '✅', text: 'Phê Duyệt Bảo Hành', path: '/evm/approvals' },
            { icon: '📢', text: 'Chiến Dịch Recall', path: '/evm/campaigns' },
            { icon: '📈', text: 'Báo Cáo', path: '/evm/reports' },
        ];
    }

    if (hasRole(ROLES.SC_STAFF)) {
        return [
            { icon: '📊', text: 'Dashboard', path: '/sc/dashboard' },
            { icon: '👥', text: 'Quản Lý Khách Hàng', path: '/sc/customers' },
            { icon: '🚗', text: 'Quản Lý Xe', path: '/sc/vehicles' },
            { icon: '📋', text: 'Tạo Báo Hành', path: '/sc/create-claim' },
            { icon: '📑', text: 'Danh Sách Báo Hành', path: '/sc/claims' },
            { icon: '👨‍🔧', text: 'Phân Công Kỹ Thuật', path: '/sc/assign' },
        ];
    }

    if (hasRole(ROLES.SC_TECHNICIAN)) {
        return [
            { icon: '📊', text: 'Dashboard', path: '/technician/dashboard' },
            { icon: '📋', text: 'Báo Hành Của Tôi', path: '/technician/my-claims' },
            { icon: '🔧', text: 'Thực Hiện Bảo Hành', path: '/technician/execute' },
            { icon: '✅', text: 'Hoàn Thành', path: '/technician/completed' },
        ];
    }

    return [];
};
