import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { executionAPI, uploadAPI } from '../services/api'
import {
  WrenchScrewdriverIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  PlusIcon
} from '../components/Icons'

const WarrantyExecution = () => {
  const [activeTab, setActiveTab] = useState('received') // 'received', 'in_progress', 'completed'
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [progressModal, setProgressModal] = useState(false)
  const [completionModal, setCompletionModal] = useState(false)
  const [progressData, setProgressData] = useState({
    description: '',
    percentage: 0,
    estimatedCompletion: ''
  })
  const [completionData, setCompletionData] = useState({
    workDescription: '',
    completionTime: new Date().toISOString().split('T')[0],
    newPartSerial: '',
    completionImages: [],
    handoverDocument: null,
    customerSignature: null
  })

  // Get technician's assigned requests
  const { data: myRequests, isLoading, refetch } = useQuery(
    ['myRequests', activeTab],
    () => executionAPI.getMyRequests({ status: activeTab }),
    {
      select: (response) => response.data.data || []
    }
  )

  // Update progress mutation
  const updateProgressMutation = useMutation(
    ({ requestId, data }) => executionAPI.updateProgress(requestId, data),
    {
      onSuccess: () => {
        setProgressModal(false)
        refetch()
      }
    }
  )

  // Complete work mutation
  const completeWorkMutation = useMutation(
    ({ requestId, data }) => executionAPI.completeWork(requestId, data),
    {
      onSuccess: () => {
        setCompletionModal(false)
        setSelectedRequest(null)
        refetch()
      }
    }
  )

  // Confirm parts received mutation
  const confirmPartsMutation = useMutation(
    ({ requestId, data }) => executionAPI.confirmPartsReceived(requestId, data),
    {
      onSuccess: () => {
        refetch()
      }
    }
  )

  const handleConfirmParts = (request) => {
    const serialNumber = prompt('Nhập số seri phụ tùng nhận được:')
    if (serialNumber) {
      confirmPartsMutation.mutate({
        requestId: request.id,
        data: {
          partSerialNumber: serialNumber,
          receivedDate: new Date().toISOString(),
          condition: 'good'
        }
      })
    }
  }

  const handleStartWork = (request) => {
    updateProgressMutation.mutate({
      requestId: request.id,
      data: {
        status: 'in_progress',
        startTime: new Date().toISOString(),
        description: 'Bắt đầu thực hiện bảo hành'
      }
    })
  }

  const handleUpdateProgress = () => {
    if (selectedRequest && progressData.description) {
      updateProgressMutation.mutate({
        requestId: selectedRequest.id,
        data: {
          ...progressData,
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  const handleCompleteWork = () => {
    if (selectedRequest && completionData.workDescription && completionData.newPartSerial) {
      completeWorkMutation.mutate({
        requestId: selectedRequest.id,
        data: {
          ...completionData,
          status: 'completed'
        }
      })
    }
  }

  const handleFileUpload = async (files, type) => {
    try {
      const uploadPromises = Array.from(files).map(file => uploadAPI.uploadImage(file))
      const results = await Promise.all(uploadPromises)
      const fileData = results.map(result => result.data.data)

      if (type === 'completion') {
        setCompletionData(prev => ({
          ...prev,
          completionImages: [...prev.completionImages, ...fileData.map(f => f.id)]
        }))
      }
    } catch (error) {
      console.error('File upload error:', error)
    }
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'parts_received': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getTabColor = (tab) => {
    const colorMap = {
      'received': 'border-yellow-500 text-yellow-600',
      'in_progress': 'border-blue-500 text-blue-600',
      'completed': 'border-green-500 text-green-600'
    }
    return activeTab === tab ? colorMap[tab] : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thực hiện bảo hành</h1>
        <p className="text-gray-600">Quản lý và thực hiện các yêu cầu bảo hành được phân công</p>
      </div>

      {/* Status Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'received', name: 'Nhận phụ tùng', count: myRequests?.filter(r => r.status === 'parts_received').length || 0 },
              { id: 'in_progress', name: 'Đang thay thế', count: myRequests?.filter(r => r.status === 'in_progress').length || 0 },
              { id: 'completed', name: 'Bàn giao xe', count: myRequests?.filter(r => r.status === 'completed').length || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${getTabColor(tab.id)}`}
              >
                <span>{tab.name}</span>
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo VIN hoặc mã yêu cầu..."
                  className="input pl-10 w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <select className="input w-48">
                <option value="">Tất cả trạng thái</option>
                <option value="parts_received">Đã nhận phụ tùng</option>
                <option value="in_progress">Đang thay thế</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests?.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{request.requestNumber}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'parts_received' ? 'Đã nhận phụ tùng' :
                          request.status === 'in_progress' ? 'Đang thay thế' :
                            request.status === 'completed' ? 'Hoàn thành' : request.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {activeTab === 'received' && request.status === 'approved' && (
                        <button
                          onClick={() => handleConfirmParts(request)}
                          className="btn btn-success btn-sm flex items-center space-x-1"
                          disabled={confirmPartsMutation.isLoading}
                        >
                          <CheckIcon className="w-4 h-4" />
                          <span>Nhận phụ tùng</span>
                        </button>
                      )}

                      {activeTab === 'received' && request.status === 'parts_received' && (
                        <button
                          onClick={() => handleStartWork(request)}
                          className="btn btn-primary btn-sm flex items-center space-x-1"
                          disabled={updateProgressMutation.isLoading}
                        >
                          <WrenchScrewdriverIcon className="w-4 h-4" />
                          <span>Bắt đầu thực hiện</span>
                        </button>
                      )}

                      {activeTab === 'in_progress' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setProgressModal(true)
                            }}
                            className="btn btn-secondary btn-sm flex items-center space-x-1"
                          >
                            <ClockIcon className="w-4 h-4" />
                            <span>Cập nhật tiến độ</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request)
                              setCompletionModal(true)
                            }}
                            className="btn btn-success btn-sm flex items-center space-x-1"
                          >
                            <CheckIcon className="w-4 h-4" />
                            <span>Hoàn thành</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="btn btn-secondary btn-sm flex items-center space-x-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>Chi tiết</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">VIN:</span>
                      <p className="font-mono">{request.vehicle?.vin}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <p>{request.vehicle?.model}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <p>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phụ tùng:</span>
                      <p className="truncate">{request.parts?.map(p => p.name).join(', ')}</p>
                    </div>
                  </div>

                  {request.progress && (
                    <div className="mt-3 bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Tiến độ thực hiện</span>
                        <span className="text-sm text-gray-500">{request.progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${request.progress.percentage}%` }}
                        ></div>
                      </div>
                      {request.progress.description && (
                        <p className="text-sm text-gray-600 mt-2">{request.progress.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {myRequests?.length === 0 && (
                <div className="text-center py-8">
                  <WrenchScrewdriverIcon className="mx-auto w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    {activeTab === 'received' ? 'Không có yêu cầu nào cần nhận phụ tùng' :
                      activeTab === 'in_progress' ? 'Không có yêu cầu nào đang thực hiện' :
                        'Không có yêu cầu nào đã hoàn thành'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Update Modal */}
      {progressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Cập nhật tiến độ
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả công việc thực hiện
                </label>
                <textarea
                  className="input h-24 resize-none"
                  placeholder="Mô tả chi tiết công việc đã thực hiện..."
                  value={progressData.description}
                  onChange={(e) => setProgressData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiến độ hoàn thành (%)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="flex-1"
                    value={progressData.percentage}
                    onChange={(e) => setProgressData(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
                  />
                  <span className="text-sm font-medium w-12">{progressData.percentage}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dự kiến hoàn thành
                </label>
                <input
                  type="datetime-local"
                  className="input"
                  value={progressData.estimatedCompletion}
                  onChange={(e) => setProgressData(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setProgressModal(false)}
                className="btn btn-secondary px-4 py-2"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateProgress}
                disabled={!progressData.description || updateProgressMutation.isLoading}
                className="btn btn-primary px-4 py-2"
              >
                {updateProgressMutation.isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {completionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Hoàn tất bảo hành & bàn giao xe
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Thông tin hoàn tất</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả công việc đã thực hiện *
                  </label>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="Mô tả chi tiết công việc đã hoàn thành..."
                    value={completionData.workDescription}
                    onChange={(e) => setCompletionData(prev => ({ ...prev, workDescription: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian hoàn tất *
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={completionData.completionTime}
                    onChange={(e) => setCompletionData(prev => ({ ...prev, completionTime: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số seri phụ tùng mới *
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Nhập số seri phụ tùng đã thay thế"
                    value={completionData.newPartSerial}
                    onChange={(e) => setCompletionData(prev => ({ ...prev, newPartSerial: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Tài liệu bàn giao</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh hoàn tất
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'completion')}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload ảnh "sau khi sửa"</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biên bản bàn giao xe
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      // Handle handover document upload
                    }}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh khách hàng ký nhận
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      // Handle customer signature upload
                    }}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ảnh chụp giấy tờ ký nhận</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">Yêu cầu bắt buộc</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Cần có đủ thông tin và tài liệu trước khi hoàn tất
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setCompletionModal(false)}
                className="btn btn-secondary px-4 py-2"
              >
                Hủy
              </button>
              <button
                onClick={handleCompleteWork}
                disabled={
                  !completionData.workDescription ||
                  !completionData.newPartSerial ||
                  completeWorkMutation.isLoading
                }
                className="btn btn-success px-4 py-2"
              >
                {completeWorkMutation.isLoading ? 'Đang xử lý...' : '✅ Xác nhận bàn giao'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarrantyExecution