import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { assignmentAPI, warrantyAPI } from '../services/api'
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '../components/Icons'

const WarrantyAssignment = () => {
  const [selectedRequests, setSelectedRequests] = useState([])
  const [assignmentModal, setAssignmentModal] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [assignmentNotes, setAssignmentNotes] = useState('')
  const [filterStatus, setFilterStatus] = useState('pending')
  const [currentPage, setCurrentPage] = useState(1)

  // Get warranty requests for assignment
  const { data: warrantyRequests, isLoading, refetch } = useQuery(
    ['warrantyRequests', filterStatus, currentPage],
    () => warrantyAPI.getWarrantyRequests({
      status: filterStatus,
      page: currentPage,
      limit: 10
    }),
    {
      select: (response) => response.data
    }
  )

  // Get available technicians
  const { data: technicians } = useQuery(
    'technicians',
    () => assignmentAPI.getTechnicians(),
    {
      select: (response) => response.data.data || []
    }
  )

  // Get technician workload
  const { data: workload } = useQuery(
    'technicianWorkload',
    () => assignmentAPI.getTechnicianWorkload(),
    {
      select: (response) => response.data.data || []
    }
  )

  // Assignment mutation
  const assignMutation = useMutation(
    ({ requestId, technicianId, notes }) =>
      assignmentAPI.assignRequest(requestId, technicianId, notes),
    {
      onSuccess: () => {
        setAssignmentModal(false)
        setSelectedRequests([])
        setSelectedTechnician('')
        setAssignmentNotes('')
        refetch()
      }
    }
  )

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === warrantyRequests?.data?.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(warrantyRequests?.data?.map(req => req.id) || [])
    }
  }

  const handleAssignRequests = () => {
    if (selectedRequests.length > 0) {
      setAssignmentModal(true)
    }
  }

  const confirmAssignment = () => {
    if (selectedTechnician && selectedRequests.length > 0) {
      // For multiple requests, assign each one individually
      selectedRequests.forEach(requestId => {
        assignMutation.mutate({
          requestId,
          technicianId: selectedTechnician,
          notes: assignmentNotes
        })
      })
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ phân công' },
      'assigned': { class: 'status-processing', text: 'Đã phân công' },
      'in_progress': { class: 'status-processing', text: 'Đang xử lý' },
      'completed': { class: 'status-completed', text: 'Hoàn thành' },
      'approved': { class: 'status-approved', text: 'Được chấp thuận' }
    }

    const statusInfo = statusMap[status] || { class: 'status-pending', text: status }

    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'high': { class: 'bg-red-100 text-red-800', text: 'Cao' },
      'medium': { class: 'bg-yellow-100 text-yellow-800', text: 'Trung bình' },
      'low': { class: 'bg-green-100 text-green-800', text: 'Thấp' }
    }

    const priorityInfo = priorityMap[priority] || { class: 'bg-gray-100 text-gray-800', text: 'Thường' }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.class}`}>
        {priorityInfo.text}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân công bảo hành</h1>
          <p className="text-gray-600">Quản lý và phân công yêu cầu bảo hành cho kỹ thuật viên</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {warrantyRequests?.meta?.total || 0}
            </p>
            <p className="text-xs text-yellow-600">Chờ phân công</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">
              {technicians?.filter(t => t.status === 'active').length || 0}
            </p>
            <p className="text-xs text-blue-600">Kỹ thuật viên</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">
              {workload?.reduce((sum, w) => sum + w.completedToday, 0) || 0}
            </p>
            <p className="text-xs text-green-600">Hoàn thành hôm nay</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters and Actions */}
          <div className="card">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    className="input w-48"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="pending">Chờ phân công</option>
                    <option value="assigned">Đã phân công</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                  </select>

                  <div className="text-sm text-gray-500">
                    {selectedRequests.length > 0 && (
                      <span>Đã chọn {selectedRequests.length} yêu cầu</span>
                    )}
                  </div>
                </div>

                {selectedRequests.length > 0 && (
                  <button
                    onClick={handleAssignRequests}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <UserGroupIcon className="w-5 h-5" />
                    <span>Phân công</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Warranty Requests Table */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Danh sách yêu cầu bảo hành
              </h3>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedRequests.length === warrantyRequests?.data?.length && warrantyRequests?.data?.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th>Mã yêu cầu</th>
                        <th>VIN</th>
                        <th>Kỹ thuật viên tạo</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Ưu tiên</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warrantyRequests?.data?.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRequests.includes(request.id)}
                              onChange={() => handleSelectRequest(request.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="font-mono text-sm font-medium">
                            {request.requestNumber}
                          </td>
                          <td className="font-mono text-sm">
                            {request.vehicle?.vin}
                          </td>
                          <td>{request.createdBy?.name}</td>
                          <td>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{getPriorityBadge(request.priority)}</td>
                          <td>
                            <button
                              className="btn btn-secondary btn-sm flex items-center space-x-1"
                              onClick={() => {
                                // Open detail modal or navigate to detail page
                              }}
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>Chi tiết</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {warrantyRequests?.data?.length === 0 && (
                    <div className="text-center py-8">
                      <ClipboardDocumentListIcon className="mx-auto w-12 h-12 text-gray-400" />
                      <p className="mt-2 text-gray-500">Không có yêu cầu bảo hành nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Technician Info */}
        <div className="space-y-6">
          {/* Technician Workload */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Khối lượng công việc
              </h3>

              <div className="space-y-4">
                {workload?.map((tech) => (
                  <div key={tech.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {tech.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {tech.specialty}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Đang xử lý:</span>
                        <span className="font-medium">{tech.inProgress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hoàn thành hôm nay:</span>
                        <span className="font-medium text-green-600">{tech.completedToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hiệu suất:</span>
                        <span className="font-medium">{tech.efficiency}%</span>
                      </div>
                    </div>

                    {/* Workload bar */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${tech.workloadPercentage > 80 ? 'bg-red-500' :
                              tech.workloadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          style={{ width: `${Math.min(tech.workloadPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tải công việc: {tech.workloadPercentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thao tác nhanh
              </h3>

              <div className="space-y-3">
                <button className="w-full btn btn-secondary text-left flex items-center space-x-2">
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Xem hiệu suất KTV</span>
                </button>

                <button className="w-full btn btn-secondary text-left flex items-center space-x-2">
                  <ClipboardDocumentListIcon className="w-4 h-4" />
                  <span>Báo cáo tiến độ</span>
                </button>

                <button className="w-full btn btn-secondary text-left flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Lịch làm việc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Phân công kỹ thuật viên
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn kỹ thuật viên chính
                </label>
                <select
                  className="input"
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                  <option value="">-- Chọn kỹ thuật viên --</option>
                  {technicians
                    ?.filter(tech => tech.status === 'active')
                    ?.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} - {tech.specialty} ({workload?.find(w => w.id === tech.id)?.workloadPercentage || 0}% tải)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú phân công
                </label>
                <textarea
                  className="input h-24 resize-none"
                  placeholder="Ghi chú về phân công..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Thông tin phân công:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Số yêu cầu: {selectedRequests.length}</li>
                  <li>• Ngày phân công: {new Date().toLocaleDateString('vi-VN')}</li>
                  {selectedTechnician && (
                    <li>• Kỹ thuật viên: {technicians?.find(t => t.id === selectedTechnician)?.name}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setAssignmentModal(false)}
                className="btn btn-secondary px-4 py-2"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmAssignment}
                disabled={!selectedTechnician || assignMutation.isLoading}
                className="btn btn-primary px-4 py-2"
              >
                {assignMutation.isLoading ? 'Đang xử lý...' : 'Xác nhận phân công'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarrantyAssignment