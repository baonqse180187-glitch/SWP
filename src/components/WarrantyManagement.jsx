import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    MagnifyingGlassIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    UserIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from '../components/Icons/index.jsx'
import { useAuth } from '../contexts/AuthContext'

const WarrantyManagement = () => {
    const { isSCStaff, isEVMStaff, isEVMAdmin } = useAuth()
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showPartSelectionModal, setShowPartSelectionModal] = useState(false)
    const [selectedParts, setSelectedParts] = useState([])
    const [updateRequest, setUpdateRequest] = useState(null)
    const [selectedImages, setSelectedImages] = useState([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteRequestId, setDeleteRequestId] = useState(null)

    // Mock data phụ tùng xe
    const vehicleParts = [
        { id: 1, name: 'Động cơ', category: 'Hệ thống động lực' },
        { id: 2, name: 'Phanh trước', category: 'Hệ thống phanh' },
        { id: 3, name: 'Lốp xe', category: 'Hệ thống di chuyển' },
        { id: 4, name: 'Hộp số', category: 'Hệ thống truyền động' },
        { id: 5, name: 'Đèn pha', category: 'Hệ thống điện' },
        { id: 6, name: 'Điều hòa', category: 'Hệ thống tiện nghi' },
        { id: 7, name: 'Pin xe điện', category: 'Hệ thống động lực' },
        { id: 8, name: 'Phanh sau', category: 'Hệ thống phanh' },
        { id: 9, name: 'Đèn hậu', category: 'Hệ thống điện' },
        { id: 10, name: 'Màn hình trung tâm', category: 'Hệ thống tiện nghi' }
    ]

    // Mock data yêu cầu bảo hành
    const mockRequests = [
        {
            id: 'WR001',
            customer: 'Nguyễn Văn A',
            phone: '0123456789',
            vehicle: {
                licensePlate: '59A-12345',
                model: 'VinFast VF8',
                vin: 'VIN123456789'
            },
            issue: 'Pin sạc không lên được',
            description: 'Xe không thể sạc pin, màn hình hiển thị lỗi charging system',
            status: 'pending',
            priority: 'high',
            createdAt: '2024-10-01',
            estimatedCost: 5000000,
            assignedTech: null,
            submittedBy: 'Phạm Văn Tùng', // Staff gửi yêu cầu
            images: [
                { id: 1, name: 'pin_sac_loi.jpg', url: 'https://via.placeholder.com/200x150/FF6B6B/ffffff?text=Pin+Sạc+Lỗi' },
                { id: 2, name: 'man_hinh_loi.jpg', url: 'https://via.placeholder.com/200x150/4ECDC4/ffffff?text=Màn+Hình+Lỗi' }
            ],
            affectedParts: [7, 10] // Pin xe điện, Màn hình trung tâm
        },
        {
            id: 'WR002',
            customer: 'Trần Thị B',
            phone: '0987654321',
            vehicle: {
                licensePlate: '59B-67890',
                model: 'VinFast VF9',
                vin: 'VIN987654321'
            },
            issue: 'Hệ thống phanh ABS bị lỗi',
            description: 'Đèn cảnh báo phanh ABS sáng liên tục, phanh cảm giác cứng',
            status: 'approved',
            priority: 'medium',
            createdAt: '2024-10-02',
            estimatedCost: 3000000,
            assignedTech: 'Lê Văn C',
            submittedBy: 'Nguyễn Thị Lan', // Staff gửi yêu cầu
            images: [
                { id: 1, name: 'phanh_abs_loi.jpg', url: 'https://via.placeholder.com/200x150/FFE66D/000000?text=Phanh+ABS+Lỗi' }
            ],
            affectedParts: [2, 8] // Phanh trước, Phanh sau
        },
        {
            id: 'WR003',
            customer: 'Phạm Văn D',
            phone: '0456789123',
            vehicle: {
                licensePlate: '59C-11111',
                model: 'VinFast VF8',
                vin: 'VIN456789123'
            },
            issue: 'Màn hình trung tâm bị đen',
            description: 'Màn hình infotainment không hiển thị, restart nhiều lần không khắc phục',
            status: 'completed',
            priority: 'low',
            createdAt: '2024-09-28',
            estimatedCost: 2000000,
            assignedTech: 'Nguyễn Văn E',
            submittedBy: 'Lê Minh Hoàng', // Staff gửi yêu cầu
            images: [
                { id: 1, name: 'man_hinh_den.jpg', url: 'https://via.placeholder.com/200x150/A8E6CF/000000?text=Màn+Hình+Đen' },
                { id: 2, name: 'loi_infotainment.jpg', url: 'https://via.placeholder.com/200x150/FF8B94/ffffff?text=Lỗi+Infotainment' }
            ],
            affectedParts: [10, 6] // Màn hình trung tâm, Điều hòa
        }
    ]




    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ duyệt', icon: ClockIcon },
            approved: { color: 'bg-blue-100 text-blue-800', text: 'Đã duyệt', icon: CheckCircleIcon },
            completed: { color: 'bg-green-100 text-green-800', text: 'Hoàn thành', icon: CheckCircleIcon },
            rejected: { color: 'bg-red-100 text-red-800', text: 'Từ chối', icon: XCircleIcon }
        }

        const config = statusConfig[status] || statusConfig.pending
        const IconComponent = config.icon

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="h-3 w-3 mr-1" />
                {config.text}
            </span>
        )
    }

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { color: 'bg-gray-100 text-gray-800', text: 'Thấp' },
            medium: { color: 'bg-orange-100 text-orange-800', text: 'Trung bình' },
            high: { color: 'bg-red-100 text-red-800', text: 'Cao' }
        }

        const config = priorityConfig[priority] || priorityConfig.medium

        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.text}
            </span>
        )
    }

    const filteredRequests = mockRequests.filter(request => {
        const matchesTab = activeTab === 'all' || request.status === activeTab
        const matchesSearch = request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
    })

    const handleViewDetails = (request) => {
        setSelectedRequest(request)
        setShowModal(true)
    }

    const handleApprove = (requestId) => {
        // Logic phê duyệt yêu cầu
        console.log('Approve request:', requestId)
    }

    const handleReject = (requestId) => {
        // Logic từ chối yêu cầu
        console.log('Reject request:', requestId)
    }

    // Functions cho SC Staff
    const handleViewStaffRequest = (request) => {
        setUpdateRequest(request)
        setShowUpdateModal(true)
    }

    const handleUpdateStaffRequest = (requestId) => {
        // Logic cập nhật yêu cầu cho SC Staff
        console.log('Update staff request:', requestId)
        setShowUpdateModal(false)
    }

    const handleDeleteStaffRequest = (requestId) => {
        setDeleteRequestId(requestId)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        // Logic xóa yêu cầu cho SC Staff
        console.log('Delete staff request:', deleteRequestId)
        setShowDeleteConfirm(false)
        setDeleteRequestId(null)
    }

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files)
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }))
        setSelectedImages(prev => [...prev, ...newImages])
    }

    const removeImage = (index) => {
        setSelectedImages(prev => {
            const newImages = [...prev]
            URL.revokeObjectURL(newImages[index].preview)
            newImages.splice(index, 1)
            return newImages
        })
    }

    const resetCreateForm = () => {
        setSelectedImages([])
        setSelectedParts([])
        setShowCreateModal(false)
    }

    const handlePartSelection = (partId) => {
        setSelectedParts(prev =>
            prev.includes(partId)
                ? prev.filter(id => id !== partId)
                : [...prev, partId]
        )
    }

    const handleConfirmPartSelection = () => {
        console.log('Selected parts:', selectedParts)
        setShowPartSelectionModal(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isSCStaff ? 'Tạo yêu cầu bảo hành' : 'Quản lý yêu cầu bảo hành'}
                        </h1>
                        <p className="text-gray-600">
                            {isSCStaff
                                ? 'Tạo yêu cầu bảo hành gửi lên hãng duyệt'
                                : 'Xem và xử lý các yêu cầu bảo hành từ khách hàng'
                            }
                        </p>

                    </div>
                    <div className="flex items-center gap-4">
                        {isSCStaff && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Tạo yêu cầu BH
                            </button>
                        )}
                        <div className="flex gap-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{mockRequests.length}</div>
                                <div className="text-sm text-blue-600">Tổng yêu cầu</div>
                            </div>
                            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {mockRequests.filter(r => r.status === 'pending').length}
                                </div>
                                <div className="text-sm text-yellow-600">Chờ duyệt</div>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {mockRequests.filter(r => r.status === 'completed').length}
                                </div>
                                <div className="text-sm text-green-600">Hoàn thành</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, biển số, mã yêu cầu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                        {[
                            { key: 'all', label: 'Tất cả' },
                            { key: 'pending', label: 'Chờ duyệt' },
                            { key: 'approved', label: 'Đã duyệt' },
                            { key: 'completed', label: 'Hoàn thành' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === tab.key
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Request List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Yêu cầu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Xe
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vấn đề
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhân viên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ưu tiên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chi phí dự kiến
                                </th>
                                {/* Hiển thị cột Thao tác cho tất cả role có quyền */}
                                {(isEVMAdmin || isEVMStaff || isSCStaff) && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{request.id}</div>
                                            <div className="text-sm text-gray-500">{request.createdAt}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{request.customer}</div>
                                            <div className="text-sm text-gray-500">{request.phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{request.vehicle.licensePlate}</div>
                                            <div className="text-sm text-gray-500">{request.vehicle.model}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{request.issue}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <div className="text-sm font-medium text-gray-900">{request.submittedBy}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(request.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getPriorityBadge(request.priority)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {request.estimatedCost.toLocaleString('vi-VN')} ₫
                                        </div>
                                    </td>
                                    {/* Cột thao tác cho các role khác nhau */}
                                    {(isEVMAdmin || isEVMStaff || isSCStaff) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Thao tác cho SC Staff - chỉ xem, cập nhật, xóa đơn của mình */}
                                            {isSCStaff && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewStaffRequest(request)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem thông tin đơn bảo hành"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStaffRequest(request.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                        title="Cập nhật đơn"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStaffRequest(request.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Xóa đơn"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Thao tác cho EVM Admin/Staff - duyệt đơn */}
                                            {(isEVMAdmin || isEVMStaff) && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(request)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem chi tiết"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(request.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Chấp nhận bảo hành"
                                                            >
                                                                <CheckCircleIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Từ chối bảo hành"
                                                            >
                                                                <XCircleIcon className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                                Chi tiết yêu cầu {selectedRequest.id}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Thông tin khách hàng</h4>
                                    <p className="text-sm text-gray-600">{selectedRequest.customer}</p>
                                    <p className="text-sm text-gray-600">{selectedRequest.phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Thông tin xe</h4>
                                    <p className="text-sm text-gray-600">{selectedRequest.vehicle.licensePlate}</p>
                                    <p className="text-sm text-gray-600">{selectedRequest.vehicle.model}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900">Mô tả vấn đề</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                            </div>

                            <div className="flex gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Trạng thái</h4>
                                    {getStatusBadge(selectedRequest.status)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Độ ưu tiên</h4>
                                    {getPriorityBadge(selectedRequest.priority)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Chi phí dự kiến</h4>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedRequest.estimatedCost.toLocaleString('vi-VN')} ₫
                                    </p>
                                </div>
                            </div>

                            {selectedRequest.status === 'pending' && (isEVMAdmin || isEVMStaff) && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            handleApprove(selectedRequest.id)
                                            setShowModal(false)
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Phê duyệt
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleReject(selectedRequest.id)
                                            setShowModal(false)
                                        }}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Warranty Request Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] p-6 overflow-y-auto shadow-2xl pointer-events-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Tạo Yêu Cầu Bảo Hành</h3>
                            <button
                                onClick={resetCreateForm}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form className="space-y-6">
                            {/* Vehicle Information Section */}
                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin xe</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* Số VIN */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số VIN <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập số VIN"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Số Seri Phụ Tùng */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số Seri Phụ Tùng
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tự động điền khi nhập VIN"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information Section */}
                            <div className="bg-blue-50 p-5 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {/* Tên Khách Hàng */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên Khách Hàng
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tự động điền khi nhập VIN"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* Số Điện Thoại */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số Điện Thoại
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tự động điền khi nhập VIN"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Problem Description Section */}
                            <div className="bg-white p-5 border border-gray-200 rounded-lg">
                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                    Mô Tả Triệu Chứng <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Mô tả chi tiết triệu chứng của xe, điều kiện xảy ra, thời điểm phát hiện..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
                                ></textarea>
                            </div>

                            {/* Attachments Section */}
                            <div className="bg-amber-50 p-5 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Đính kèm tài liệu</h4>

                                {/* File Upload */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Hình ảnh minh chứng
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            id="warranty-images"
                                            onChange={handleImageUpload}
                                        />
                                        <label
                                            htmlFor="warranty-images"
                                            className="cursor-pointer"
                                        >
                                            <div className="text-gray-600">
                                                <div className="text-4xl mb-3">📤</div>
                                                <p className="font-medium mb-1">Tải Ảnh Lên</p>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Kéo thả file hoặc click để chọn
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Hỗ trợ: JPG, PNG, GIF (Tối đa 10MB mỗi file)
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Preview uploaded images */}
                                    {selectedImages.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Hình ảnh đã chọn ({selectedImages.length})
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {selectedImages.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image.preview}
                                                            alt={image.name}
                                                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ✕
                                                        </button>
                                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                                            {image.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Part Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Phụ tùng bị ảnh hưởng
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPartSelectionModal(true)}
                                        className="inline-flex items-center px-5 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="mr-2">⚙️</span>
                                        Chọn Phụ Tùng Bị Ảnh Hưởng
                                        {selectedParts.length > 0 && (
                                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {selectedParts.length}
                                            </span>
                                        )}
                                    </button>

                                    {/* Display selected parts */}
                                    {selectedParts.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Phụ tùng đã chọn ({selectedParts.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedParts.map((partId) => {
                                                    const part = vehicleParts.find(p => p.id === partId)
                                                    return part ? (
                                                        <span key={partId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                            {part.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePartSelection(partId)}
                                                                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    ) : null
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-5 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    onClick={resetCreateForm}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('Yêu cầu bảo hành đã được tạo!')
                                        setShowCreateModal(false)
                                    }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-lg"
                                >
                                    <span className="mr-2">📄</span>
                                    Tạo Yêu Cầu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Part Selection Modal */}
            {/* Parts Selection Modal - Using Portal for highest z-index */}
            {showPartSelectionModal && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">⚙️ Chọn Phụ Tùng Bị Ảnh Hưởng</h3>
                            <button
                                onClick={() => setShowPartSelectionModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Parts List */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vehicleParts.map((part) => (
                                    <div
                                        key={part.id}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedParts.includes(part.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handlePartSelection(part.id)}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedParts.includes(part.id)}
                                                onChange={() => handlePartSelection(part.id)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium text-gray-900">{part.name}</h4>
                                                <p className="text-xs text-gray-500">({part.category})</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Selected Parts Summary */}
                            {selectedParts.length > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                                        Phụ tùng đã chọn ({selectedParts.length}):
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedParts.map(partId => {
                                            const part = vehicleParts.find(p => p.id === partId)
                                            return (
                                                <span
                                                    key={partId}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                >
                                                    {part?.name}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handlePartSelection(partId)
                                                        }}
                                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowPartSelectionModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPartSelection}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                disabled={selectedParts.length === 0}
                            >
                                Xác nhận ({selectedParts.length})
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* View/Edit Modal for SC Staff */}
            {showUpdateModal && updateRequest && isSCStaff && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Thông tin đơn bảo hành - {updateRequest.id}</h3>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-6 space-y-6">
                            {/* Status and Basic Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã yêu cầu</label>
                                        <input type="text" value={updateRequest.id} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                        <div className="px-3 py-2">
                                            {getStatusBadge(updateRequest.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                                        <input type="text" value={updateRequest.createdAt} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Thông tin khách hàng</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
                                        <input type="text" defaultValue={updateRequest.customer} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                        <input type="text" defaultValue={updateRequest.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Thông tin xe</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                                        <input type="text" defaultValue={updateRequest.vehicle.licensePlate} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model xe</label>
                                        <input type="text" defaultValue={updateRequest.vehicle.model} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Số VIN</label>
                                        <input type="text" defaultValue={updateRequest.vehicle.vin} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Problem Description */}
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Mô tả sự cố</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vấn đề chính</label>
                                        <input type="text" defaultValue={updateRequest.issue} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                        <textarea rows={3} defaultValue={updateRequest.description} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ ưu tiên</label>
                                            <select defaultValue={updateRequest.priority} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="low">Thấp</option>
                                                <option value="medium">Trung bình</option>
                                                <option value="high">Cao</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí dự kiến</label>
                                            <input type="number" defaultValue={updateRequest.estimatedCost} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Hình ảnh minh chứng</h4>
                                {updateRequest.images && updateRequest.images.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {updateRequest.images.map((image) => (
                                            <div key={image.id} className="relative group">
                                                <img src={image.url} alt={image.name} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{image.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm mb-4">Chưa có hình ảnh nào được tải lên</p>
                                )}

                                {/* Add more images */}
                                <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                    <input type="file" multiple accept="image/*" className="hidden" id="additional-images" onChange={handleImageUpload} />
                                    <label htmlFor="additional-images" className="cursor-pointer">
                                        <div className="text-purple-600">
                                            <div className="text-xl mb-1">📤</div>
                                            <p className="font-medium text-sm">Thêm hình ảnh</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Preview newly uploaded images */}
                                {selectedImages.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Hình ảnh mới thêm ({selectedImages.length})</p>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                            {selectedImages.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={image.preview} alt={image.name} className="w-full h-16 object-cover rounded border" />
                                                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Affected Parts Section */}
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Phụ tùng bị ảnh hưởng</h4>
                                {updateRequest.affectedParts && updateRequest.affectedParts.length > 0 ? (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Phụ tùng hiện tại</p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {updateRequest.affectedParts.map((partId) => {
                                                const part = vehicleParts.find(p => p.id === partId)
                                                return part ? (
                                                    <span key={partId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-800">
                                                        {part.name}
                                                        <span className="ml-1 text-xs text-orange-600">({part.category})</span>
                                                    </span>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm mb-4">Chưa có phụ tùng nào được chọn</p>
                                )}

                                {/* Add/Edit parts */}
                                <button type="button" onClick={() => setShowPartSelectionModal(true)} className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-lg bg-white text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors">
                                    <span className="mr-2">⚙️</span>
                                    Chỉnh sửa phụ tùng
                                    {selectedParts.length > 0 && (
                                        <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">+{selectedParts.length}</span>
                                    )}
                                </button>

                                {/* Display newly selected parts */}
                                {selectedParts.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Phụ tùng mới thêm</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedParts.map((partId) => {
                                                const part = vehicleParts.find(p => p.id === partId)
                                                return part ? (
                                                    <span key={partId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {part.name}
                                                        <button type="button" onClick={() => handlePartSelection(partId)} className="ml-1 inline-flex items-center justify-center w-3 h-3 rounded-full text-green-600 hover:bg-green-200">✕</button>
                                                    </span>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer with 3 buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    handleUpdateStaffRequest(updateRequest.id)
                                }}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Cập nhật thông tin
                            </button>
                            <button
                                onClick={() => {
                                    setShowUpdateModal(false)
                                    handleDeleteStaffRequest(updateRequest.id)
                                }}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Xóa đơn
                            </button>
                        </div>
                    </div>
                </div>
            )}            {/* Delete Confirmation Dialog */}
            {/* Delete Confirmation Modal - Using Portal for highest z-index */}
            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full" style={{ zIndex: 9999 }}>
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <TrashIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Xác nhận xóa
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Bạn có muốn xóa đơn bảo hành này không?
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Hành động này không thể hoàn tác.
                                </p>
                            </div>
                            <div className="flex gap-3 px-4 py-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none"
                                >
                                    Xóa đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default WarrantyManagement