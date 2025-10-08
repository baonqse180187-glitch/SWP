import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { warrantyAPI, vehicleAPI, uploadAPI } from '../services/api'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '../components/Icons'

const WarrantyRequest = () => {
  const [selectedVin, setSelectedVin] = useState('')
  const [vehicleInfo, setVehicleInfo] = useState(null)
  const [formData, setFormData] = useState({
    vinNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    selectedParts: [],
    reportFiles: [],
    images: [],
    diagnosticInfo: ''
  })
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Search vehicle by VIN
  const { data: vehicleData, isLoading: vehicleLoading } = useQuery(
    ['vehicle', selectedVin],
    () => vehicleAPI.getVehicleByVin(selectedVin),
    {
      enabled: selectedVin.length >= 10,
      select: (response) => response.data.data,
      onSuccess: (data) => {
        setVehicleInfo(data)
        setFormData(prev => ({ ...prev, vinNumber: data.vin }))
      }
    }
  )

  // Get vehicle parts
  const { data: vehicleParts } = useQuery(
    ['vehicleParts', selectedVin],
    () => vehicleAPI.getVehicleParts(selectedVin),
    {
      enabled: !!vehicleInfo,
      select: (response) => response.data.data || []
    }
  )

  // Create warranty request mutation
  const createRequestMutation = useMutation(
    (requestData) => warrantyAPI.createWarrantyRequest(requestData),
    {
      onSuccess: (data) => {
        // Reset form and show success message
        setFormData({
          vinNumber: '',
          issueDate: new Date().toISOString().split('T')[0],
          description: '',
          selectedParts: [],
          reportFiles: [],
          images: [],
          diagnosticInfo: ''
        })
        setSelectedVin('')
        setVehicleInfo(null)
        setUploadedFiles([])
      }
    }
  )

  const handleVinSearch = () => {
    if (selectedVin.length >= 10) {
      // Query will trigger automatically
    }
  }

  const handlePartSelection = (partId) => {
    setFormData(prev => ({
      ...prev,
      selectedParts: prev.selectedParts.includes(partId)
        ? prev.selectedParts.filter(id => id !== partId)
        : [...prev.selectedParts, partId]
    }))
  }

  const handleFileUpload = async (files, type) => {
    try {
      const uploadPromises = Array.from(files).map(file => {
        return type === 'image' 
          ? uploadAPI.uploadImage(file)
          : uploadAPI.uploadDocument(file)
      })

      const results = await Promise.all(uploadPromises)
      const fileData = results.map(result => result.data.data)

      setUploadedFiles(prev => [...prev, ...fileData])
      
      if (type === 'image') {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...fileData.map(f => f.id)]
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          reportFiles: [...prev.reportFiles, ...fileData.map(f => f.id)]
        }))
      }
    } catch (error) {
      console.error('File upload error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!vehicleInfo || formData.selectedParts.length === 0) {
      return
    }

    const requestData = {
      ...formData,
      vehicleId: vehicleInfo.id,
      status: 'draft'
    }

    createRequestMutation.mutate(requestData)
  }

  const handleSubmitToManufacturer = async () => {
    // First save as draft, then submit
    const requestData = {
      ...formData,
      vehicleId: vehicleInfo.id,
      status: 'submitted'
    }

    createRequestMutation.mutate(requestData)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tạo yêu cầu bảo hành</h1>
        <p className="text-gray-600">Tạo yêu cầu bảo hành mới cho khách hàng</p>
      </div>

      {/* Step 1: Vehicle Search */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bước 1: Tra cứu hồ sơ xe</h3>
          
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Nhập VIN hoặc quét QR code"
                  value={selectedVin}
                  onChange={(e) => setSelectedVin(e.target.value.toUpperCase())}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleVinSearch}
              disabled={selectedVin.length < 10 || vehicleLoading}
              className="btn btn-primary px-6"
            >
              {vehicleLoading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
          </div>

          {vehicleInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Thông tin xe</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Model:</span>
                  <p className="text-blue-900">{vehicleInfo.model}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Năm SX:</span>
                  <p className="text-blue-900">{vehicleInfo.productionYear}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Ngày bán:</span>
                  <p className="text-blue-900">{vehicleInfo.saleDate ? new Date(vehicleInfo.saleDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Khách hàng:</span>
                  <p className="text-blue-900">{vehicleInfo.owner?.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Create Warranty Request */}
      {vehicleInfo && (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Bước 2: Tạo yêu cầu bảo hành mới</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - General Info */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Thông tin chung</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã yêu cầu (tự sinh)
                    </label>
                    <input
                      type="text"
                      className="input bg-gray-50"
                      value={`WR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN
                    </label>
                    <input
                      type="text"
                      className="input bg-gray-50"
                      value={formData.vinNumber}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày phát hiện lỗi
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={formData.issueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả sự cố
                    </label>
                    <textarea
                      className="input h-32 resize-none"
                      placeholder="Mô tả chi tiết sự cố và triệu chứng..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Right Column - Technical Info */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Thông tin kỹ thuật</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phụ tùng cần bảo hành
                    </label>
                    {vehicleParts && vehicleParts.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {vehicleParts.map((part) => (
                          <label key={part.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={formData.selectedParts.includes(part.id)}
                              onChange={() => handlePartSelection(part.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-900">
                              {part.name} - {part.serialNumber}
                            </span>
                            <span className={`status-badge ${part.type === 'main' ? 'status-processing' : 'status-pending'}`}>
                              {part.type === 'main' ? 'Chính' : 'Phụ'}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Không có thông tin phụ tùng</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đính kèm báo cáo kỹ thuật
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e.target.files, 'document')}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh hư hỏng
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'image')}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (tối đa 5MB/file)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thông tin chẩn đoán
                    </label>
                    <textarea
                      className="input h-24 resize-none"
                      placeholder="Mã lỗi, kết quả đo, thông số kỹ thuật..."
                      value={formData.diagnosticInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, diagnosticInfo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">File đã tải lên</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <DocumentIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-900 truncate">{file.filename}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
                            setFormData(prev => ({
                              ...prev,
                              reportFiles: prev.reportFiles.filter(id => id !== file.id),
                              images: prev.images.filter(id => id !== file.id)
                            }))
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  type="submit"
                  className="btn btn-secondary px-6"
                  disabled={createRequestMutation.isLoading}
                >
                  ✅ Lưu tạm
                </button>
                <button
                  type="button"
                  onClick={handleSubmitToManufacturer}
                  disabled={
                    createRequestMutation.isLoading ||
                    !formData.description ||
                    formData.selectedParts.length === 0
                  }
                  className="btn btn-primary px-6"
                >
                  📤 Gửi lên hãng
                </button>
              </div>

              {/* Validation Messages */}
              {formData.selectedParts.length === 0 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mr-2" />
                    <p className="text-sm text-yellow-700">
                      Vui lòng chọn ít nhất một phụ tùng cần bảo hành
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Step 3: Submit Confirmation (Modal would go here) */}
      {createRequestMutation.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đang gửi yêu cầu...
              </h3>
              <p className="text-sm text-gray-500">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarrantyRequest