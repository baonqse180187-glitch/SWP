import React, { useState } from 'react'
import {
    ClockIcon,
    CheckCircleIcon,
    WrenchScrewdriverIcon,
    CameraIcon,
    DocumentTextIcon,
    UserIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    ChatBubbleLeftRightIcon,
    ArrowUpTrayIcon
} from '../components/Icons'

const RepairProgress = () => {
    const [activeTab, setActiveTab] = useState('inProgress')
    const [selectedJob, setSelectedJob] = useState(null)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        status: '',
        progress: 0,
        notes: '',
        images: []
    })

    // Mock data công việc sửa chữa
    const repairJobs = [
        {
            id: 'RJ001',
            requestId: 'WR001',
            customer: 'Nguyễn Văn A',
            vehicle: '59A-12345 - VinFast VF8',
            issue: 'Pin sạc không lên được',
            technician: 'Lê Văn A',
            status: 'in-progress',
            progress: 60,
            startDate: '2024-10-01',
            estimatedCompletion: '2024-10-05',
            priority: 'high',
            updates: [
                {
                    id: 1,
                    date: '2024-10-01 08:00',
                    status: 'started',
                    notes: 'Bắt đầu kiểm tra hệ thống pin',
                    technician: 'Lê Văn A',
                    images: ['img1.jpg']
                },
                {
                    id: 2,
                    date: '2024-10-01 14:00',
                    status: 'diagnosed',
                    notes: 'Phát hiện lỗi ở module BMS, cần thay thế',
                    technician: 'Lê Văn A',
                    images: ['img2.jpg', 'img3.jpg']
                },
                {
                    id: 3,
                    date: '2024-10-02 09:00',
                    status: 'parts-ordered',
                    notes: 'Đã đặt hàng module BMS mới, dự kiến về ngày 04/10',
                    technician: 'Lê Văn A',
                    images: []
                }
            ],
            partsUsed: [
                { name: 'Module BMS', partNumber: 'BMS-VF8-001', quantity: 1, cost: 2000000 }
            ],
            laborHours: 8,
            totalCost: 2500000
        },
        {
            id: 'RJ002',
            requestId: 'WR002',
            customer: 'Trần Thị B',
            vehicle: '59B-67890 - VinFast VF9',
            issue: 'Hệ thống phanh ABS bị lỗi',
            technician: 'Nguyễn Thị B',
            status: 'completed',
            progress: 100,
            startDate: '2024-09-28',
            completedDate: '2024-09-30',
            estimatedCompletion: '2024-09-30',
            priority: 'medium',
            updates: [
                {
                    id: 1,
                    date: '2024-09-28 08:00',
                    status: 'started',
                    notes: 'Bắt đầu kiểm tra hệ thống phanh ABS',
                    technician: 'Nguyễn Thị B',
                    images: []
                },
                {
                    id: 2,
                    date: '2024-09-29 10:00',
                    status: 'parts-replaced',
                    notes: 'Thay thế cảm biến ABS bánh trước phải',
                    technician: 'Nguyễn Thị B',
                    images: ['img4.jpg']
                },
                {
                    id: 3,
                    date: '2024-09-30 15:00',
                    status: 'completed',
                    notes: 'Hoàn thành sửa chữa, test thành công',
                    technician: 'Nguyễn Thị B',
                    images: ['img5.jpg']
                }
            ],
            partsUsed: [
                { name: 'Cảm biến ABS', partNumber: 'ABS-SENSOR-001', quantity: 1, cost: 500000 }
            ],
            laborHours: 6,
            totalCost: 800000
        }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'on-hold':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'in-progress':
                return 'Đang thực hiện'
            case 'completed':
                return 'Hoàn thành'
            case 'on-hold':
                return 'Tạm dừng'
            case 'cancelled':
                return 'Hủy bỏ'
            default:
                return 'Không xác định'
        }
    }

    const getUpdateStatusText = (status) => {
        switch (status) {
            case 'started':
                return 'Bắt đầu'
            case 'diagnosed':
                return 'Chẩn đoán'
            case 'parts-ordered':
                return 'Đặt hàng linh kiện'
            case 'parts-replaced':
                return 'Thay thế linh kiện'
            case 'testing':
                return 'Kiểm tra'
            case 'completed':
                return 'Hoàn thành'
            default:
                return status
        }
    }

    const filteredJobs = repairJobs.filter(job => {
        if (activeTab === 'all') return true
        if (activeTab === 'inProgress') return job.status === 'in-progress'
        if (activeTab === 'completed') return job.status === 'completed'
        if (activeTab === 'onHold') return job.status === 'on-hold'
        return true
    })

    const handleUpdateProgress = (job) => {
        setSelectedJob(job)
        setUpdateForm({
            status: job.status,
            progress: job.progress,
            notes: '',
            images: []
        })
        setShowUpdateModal(true)
    }

    const submitUpdate = () => {
        console.log('Cập nhật tiến độ:', {
            jobId: selectedJob.id,
            ...updateForm
        })
        setShowUpdateModal(false)
        setSelectedJob(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Theo dõi tiến độ sửa chữa</h1>
                <p className="text-gray-600">Quản lý và cập nhật tiến độ các công việc sửa chữa</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {repairJobs.filter(j => j.status === 'in-progress').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {repairJobs.filter(j => j.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <ClockIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Trung bình (giờ)</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(repairJobs.reduce((acc, job) => acc + job.laborHours, 0) / repairJobs.length)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <ExclamationTriangleIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Ưu tiên cao</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {repairJobs.filter(j => j.priority === 'high').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { key: 'inProgress', label: 'Đang thực hiện', count: repairJobs.filter(j => j.status === 'in-progress').length },
                            { key: 'completed', label: 'Hoàn thành', count: repairJobs.filter(j => j.status === 'completed').length },
                            { key: 'onHold', label: 'Tạm dừng', count: repairJobs.filter(j => j.status === 'on-hold').length },
                            { key: 'all', label: 'Tất cả', count: repairJobs.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Job List */}
                <div className="p-6">
                    <div className="space-y-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{job.id}</h3>
                                        <p className="text-sm text-gray-600">{job.customer} - {job.vehicle}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                            {getStatusText(job.status)}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateProgress(job)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            Cập nhật tiến độ
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Thông tin công việc</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Vấn đề:</span> {job.issue}
                                            </div>
                                            <div>
                                                <span className="font-medium">Kỹ thuật viên:</span> {job.technician}
                                            </div>
                                            <div>
                                                <span className="font-medium">Bắt đầu:</span> {job.startDate}
                                            </div>
                                            <div>
                                                <span className="font-medium">Dự kiến:</span> {job.estimatedCompletion}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Tiến độ</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Hoàn thành</span>
                                                    <span>{job.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${job.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Giờ làm việc:</span> {job.laborHours}h
                                                </div>
                                                <div>
                                                    <span className="font-medium">Tổng chi phí:</span> {job.totalCost.toLocaleString('vi-VN')} ₫
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Linh kiện sử dụng</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            {job.partsUsed.map((part, index) => (
                                                <div key={index}>
                                                    <div className="font-medium">{part.name}</div>
                                                    <div>
                                                        {part.partNumber} - SL: {part.quantity} - {part.cost.toLocaleString('vi-VN')} ₫
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Lịch sử cập nhật</h4>
                                    <div className="space-y-3">
                                        {job.updates.map((update, index) => (
                                            <div key={update.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                                                        }`}></div>
                                                    {index < job.updates.length - 1 && (
                                                        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {getUpdateStatusText(update.status)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{update.date}</span>
                                                        <span className="text-xs text-gray-500">• {update.technician}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{update.notes}</p>
                                                    {update.images.length > 0 && (
                                                        <div className="flex gap-2">
                                                            {update.images.map((img, imgIndex) => (
                                                                <div key={imgIndex} className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
                                                                    <CameraIcon className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Update Progress Modal */}
            {showUpdateModal && selectedJob && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                                Cập nhật tiến độ - {selectedJob.id}
                            </h3>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="in-progress">Đang thực hiện</option>
                                    <option value="on-hold">Tạm dừng</option>
                                    <option value="completed">Hoàn thành</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiến độ ({updateForm.progress}%)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={updateForm.progress}
                                    onChange={(e) => setUpdateForm({ ...updateForm, progress: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú cập nhật
                                </label>
                                <textarea
                                    value={updateForm.notes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mô tả công việc đã thực hiện..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình ảnh
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Kéo thả hoặc click để tải lên hình ảnh</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={submitUpdate}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Cập nhật tiến độ
                                </button>
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RepairProgress