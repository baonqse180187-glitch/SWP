import React, { useState } from 'react'

const WarrantyAssignment = () => {
    // State variables
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [showAllTechniciansModal, setShowAllTechniciansModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [selectedTechnician, setSelectedTechnician] = useState(null)
    const [scheduleData, setScheduleData] = useState(null)
    const [assignedRequests, setAssignedRequests] = useState([])
    const [availableRequests, setAvailableRequests] = useState([
        {
            id: 'WR2024001',
            customer: 'Nguyễn Văn A',
            vehicle: 'Tesla Model 3 2023',
            issue: 'Hệ thống sạc pin không hoạt động',
            priority: 'high',
            requiredSkill: 'Hệ thống điện EV',
            estimatedTime: '2-3 giờ',
            location: 'Hà Nội'
        },
        {
            id: 'WR2024002',
            customer: 'Trần Thị B',
            vehicle: 'VinFast VF8 2024',
            issue: 'Pin xe bị sụt dung lượng nhanh',
            priority: 'medium',
            requiredSkill: 'Hệ thống pin EV',
            estimatedTime: '3-4 giờ',
            location: 'TP.HCM'
        }
    ])

    // Mock data for suggested technicians
    const suggestedTechnicians = {
        'WR2024001': [
            {
                id: 'T003',
                name: 'Phạm Văn E',
                speciality: 'Chuyên gia Hệ thống điện EV',
                rating: 4.8,
                availability: 'Sẵn sàng',
                matchScore: 95,
                estimatedCompletion: '2 giờ'
            }
        ],
        'WR2024002': [
            {
                id: 'T001',
                name: 'Nguyễn Minh A',
                speciality: 'Chuyên gia Pin xe điện',
                rating: 4.9,
                availability: 'Sẵn sàng',
                matchScore: 98,
                estimatedCompletion: '3 giờ'
            }
        ]
    }

    // Mock data for all available technicians
    const allTechnicians = [
        {
            id: 'T001',
            name: 'Nguyễn Minh A',
            speciality: 'Chuyên gia Pin xe điện',
            experience: '8 năm',
            rating: 4.9,
            status: 'available',
            currentWorkload: 3,
            maxWorkload: 5,
            location: 'Hà Nội',
            completedJobs: 234,
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 'T002',
            name: 'Trần Văn B',
            speciality: 'Kỹ sư Hệ thống sạc',
            experience: '6 năm',
            rating: 4.7,
            status: 'busy',
            currentWorkload: 4,
            maxWorkload: 5,
            location: 'TP.HCM',
            completedJobs: 189,
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 'T003',
            name: 'Phạm Văn E',
            speciality: 'Chuyên gia Hệ thống điện EV',
            experience: '5 năm',
            rating: 4.8,
            status: 'available',
            currentWorkload: 2,
            maxWorkload: 4,
            location: 'Đà Nẵng',
            completedJobs: 156,
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 'T004',
            name: 'Lê Thị D',
            speciality: 'Kỹ sư Phần mềm EV',
            experience: '4 năm',
            rating: 4.5,
            status: 'available',
            currentWorkload: 1,
            maxWorkload: 4,
            location: 'Hải Phòng',
            completedJobs: 98,
            avatar: '/api/placeholder/40/40'
        },
        {
            id: 'T005',
            name: 'Hoàng Thị G',
            speciality: 'Chuyên gia Chuẩn đoán EV',
            experience: '3 năm',
            rating: 4.6,
            status: 'off',
            currentWorkload: 0,
            maxWorkload: 4,
            location: 'Cần Thơ',
            completedJobs: 67,
            avatar: '/api/placeholder/40/40'
        }
    ]

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800'
            case 'busy': return 'bg-yellow-100 text-yellow-800'
            case 'off': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'available': return 'Sẵn sàng'
            case 'busy': return 'Bận'
            case 'off': return 'Nghỉ'
            default: return 'Không xác định'
        }
    }

    const getWorkloadPercentage = (current, max) => {
        return (current / max) * 100
    }

    // Event handlers
    const showAllTechniciansForRequest = (request) => {
        setSelectedRequest(request)
        setShowAllTechniciansModal(true)
    }

    const assignTechnicianFromModal = (technician) => {
        setSelectedTechnician(technician)
        setShowAllTechniciansModal(false)
        setShowAssignModal(true)
    }

    const assignTechnicianDirectly = (request, technician) => {
        setSelectedRequest(request)
        setSelectedTechnician(technician)
        setShowAssignModal(true)
    }

    const confirmAssignment = () => {
        // Tạo object assignment mới
        const newAssignment = {
            ...selectedRequest,
            technician: selectedTechnician,
            assignedDate: new Date().toLocaleDateString('vi-VN'),
            assignedTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            status: 'assigned'
        }

        // Thêm vào danh sách đã phân công
        setAssignedRequests(prev => [...prev, newAssignment])

        // Xóa khỏi danh sách chờ phân công
        setAvailableRequests(prev => prev.filter(req => req.id !== selectedRequest.id))

        // Thông báo thành công
        alert(`Đã phân công ${selectedTechnician.name} cho yêu cầu ${selectedRequest.id}`)

        // Đóng modal và reset state
        setShowAssignModal(false)
        setSelectedRequest(null)
        setSelectedTechnician(null)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Phân công bảo hành</h1>
                <p className="text-gray-600">Quản lý phân công kỹ thuật viên cho các yêu cầu bảo hành</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Yêu cầu chờ phân công */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Yêu cầu chờ phân công</h2>
                        <p className="text-sm text-gray-600">{availableRequests.length} yêu cầu đang chờ</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {availableRequests.map((request) => (
                                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-blue-600">{request.id}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.priority === 'high' ? 'Cao' : 'Trung bình'}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-gray-900">{request.vehicle}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{request.issue}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                        <div><span className="font-medium">Khách hàng:</span> {request.customer}</div>
                                        <div><span className="font-medium">Kỹ năng:</span> {request.requiredSkill}</div>
                                        <div><span className="font-medium">Thời gian:</span> {request.estimatedTime}</div>
                                        <div><span className="font-medium">Địa điểm:</span> {request.location}</div>
                                    </div>

                                    {/* Kỹ thuật viên được đề xuất */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Kỹ thuật viên phù hợp</h4>
                                        <div className="space-y-2">
                                            {suggestedTechnicians[request.id]?.map((tech) => (
                                                <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-gray-900">{tech.name}</span>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {tech.matchScore}% phù hợp
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {tech.speciality} • ⭐ {tech.rating} • {tech.availability}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Hoàn thành dự kiến: {tech.estimatedCompletion}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => assignTechnicianDirectly(request, tech)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                                    >
                                                        Phân công
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => showAllTechniciansForRequest(request)}
                                            className="w-full mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm border border-gray-300"
                                        >
                                            📋 Hiển thị tất cả kỹ thuật viên để phân công
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Danh sách đã phân công */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Danh sách phân công</h2>
                        <p className="text-sm text-gray-600">{assignedRequests.length} yêu cầu đã được phân công</p>
                    </div>
                    <div className="p-6">
                        {assignedRequests.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>Chưa có yêu cầu nào được phân công</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assignedRequests.map((assignment) => (
                                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-blue-600">{assignment.id}</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Đã phân công
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {assignment.assignedDate} • {assignment.assignedTime}
                                            </div>
                                        </div>

                                        <h3 className="font-medium text-gray-900 mb-1">{assignment.vehicle}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{assignment.issue}</p>

                                        <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                                            <h4 className="font-medium text-gray-900 mb-2">Kỹ thuật viên được phân công</h4>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={assignment.technician.avatar || '/api/placeholder/32/32'}
                                                    alt={assignment.technician.name}
                                                    className="w-8 h-8 rounded-full bg-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 text-sm">{assignment.technician.name}</div>
                                                    <div className="text-xs text-gray-600">{assignment.technician.speciality}</div>
                                                    <div className="text-xs text-gray-500">
                                                        ⭐ {assignment.technician.rating} • {assignment.technician.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div><span className="font-medium">Khách hàng:</span> {assignment.customer}</div>
                                            <div><span className="font-medium">Thời gian dự kiến:</span> {assignment.estimatedTime}</div>
                                            <div><span className="font-medium">Kỹ năng:</span> {assignment.requiredSkill}</div>
                                            <div><span className="font-medium">Địa điểm:</span> {assignment.location}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal hiển thị tất cả kỹ thuật viên */}
            {showAllTechniciansModal && selectedRequest && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3 border-b">
                            <h3 className="text-lg font-bold text-gray-900">
                                Chọn kỹ thuật viên cho yêu cầu {selectedRequest.id}
                            </h3>
                            <button
                                onClick={() => setShowAllTechniciansModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4">
                            {/* Thông tin yêu cầu */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Thông tin yêu cầu</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div><span className="font-medium">Xe:</span> {selectedRequest.vehicle}</div>
                                    <div><span className="font-medium">Vấn đề:</span> {selectedRequest.issue}</div>
                                    <div><span className="font-medium">Kỹ năng:</span> {selectedRequest.requiredSkill}</div>
                                    <div><span className="font-medium">Thời gian:</span> {selectedRequest.estimatedTime}</div>
                                </div>
                            </div>

                            {/* Danh sách tất cả kỹ thuật viên */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {allTechnicians.map((tech) => (
                                    <div key={tech.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={tech.avatar}
                                                alt={tech.name}
                                                className="w-12 h-12 rounded-full bg-gray-200"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{tech.name}</h3>
                                                        <p className="text-sm text-gray-600">{tech.speciality}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tech.status)}`}>
                                                        {getStatusText(tech.status)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                                    <div><span className="font-medium">Kinh nghiệm:</span> {tech.experience}</div>
                                                    <div><span className="font-medium">Đánh giá:</span> ⭐ {tech.rating}</div>
                                                    <div><span className="font-medium">Vị trí:</span> {tech.location}</div>
                                                    <div><span className="font-medium">Hoàn thành:</span> {tech.completedJobs}</div>
                                                </div>

                                                {/* Workload Bar */}
                                                <div className="mb-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-medium text-gray-700">Khối lượng công việc</span>
                                                        <span className="text-xs text-gray-600">{tech.currentWorkload}/{tech.maxWorkload}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${getWorkloadPercentage(tech.currentWorkload, tech.maxWorkload) >= 80
                                                                ? 'bg-red-500'
                                                                : getWorkloadPercentage(tech.currentWorkload, tech.maxWorkload) >= 60
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${getWorkloadPercentage(tech.currentWorkload, tech.maxWorkload)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => assignTechnicianFromModal(tech)}
                                                    disabled={tech.status === 'off'}
                                                    className={`w-full px-3 py-2 rounded text-sm ${tech.status === 'off'
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                >
                                                    {tech.status === 'off' ? 'Không khả dụng' : 'Phân công'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowAllTechniciansModal(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận phân công */}
            {showAssignModal && selectedRequest && selectedTechnician && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center pb-3">
                            <h3 className="text-lg font-bold text-gray-900">Xác nhận phân công</h3>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Thông tin yêu cầu</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Mã yêu cầu:</span> {selectedRequest.id}
                                    </div>
                                    <div>
                                        <span className="font-medium">Khách hàng:</span> {selectedRequest.customer}
                                    </div>
                                    <div>
                                        <span className="font-medium">Xe:</span> {selectedRequest.vehicle}
                                    </div>
                                    <div>
                                        <span className="font-medium">Vấn đề:</span> {selectedRequest.issue}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Kỹ thuật viên được chọn</h4>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedTechnician.avatar || '/api/placeholder/40/40'}
                                        alt={selectedTechnician.name}
                                        className="w-12 h-12 rounded-full bg-gray-200"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{selectedTechnician.name}</div>
                                        <div className="text-sm text-gray-600">{selectedTechnician.speciality}</div>
                                        <div className="text-sm text-gray-600">
                                            Rating: ⭐ {selectedTechnician.rating}
                                            {selectedTechnician.matchScore && ` • ${selectedTechnician.matchScore}% phù hợp`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={confirmAssignment}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Xác nhận phân công
                                </button>
                                <button
                                    onClick={() => setShowAssignModal(false)}
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

export default WarrantyAssignment