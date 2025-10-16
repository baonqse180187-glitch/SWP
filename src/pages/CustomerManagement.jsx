import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { customerAPI, vehicleAPI } from '../services/api'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon
} from '../components/Icons'

const CustomerManagement = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    searchType: 'all' // 'all', 'vin', 'name', 'phone'
  })
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [activeTab, setActiveTab] = useState('info') // 'info', 'parts', 'history', 'notes'
  const [vehicleNotes, setVehicleNotes] = useState('')

  // Search customers
  const { data: searchResults, isLoading: searchLoading, refetch } = useQuery(
    ['searchCustomers', searchParams],
    () => customerAPI.searchCustomers(searchParams),
    {
      enabled: searchParams.query.length >= 2,
      select: (response) => response.data.data || []
    }
  )

  // Get vehicle details
  const { data: vehicleDetails } = useQuery(
    ['vehicleDetails', selectedVehicle?.vin],
    () => vehicleAPI.getVehicleDetails(selectedVehicle.vin),
    {
      enabled: !!selectedVehicle?.vin,
      select: (response) => response.data.data
    }
  )

  // Get vehicle parts
  const { data: vehicleParts } = useQuery(
    ['vehicleParts', selectedVehicle?.vin],
    () => vehicleAPI.getVehicleParts(selectedVehicle.vin),
    {
      enabled: !!selectedVehicle?.vin && activeTab === 'parts',
      select: (response) => response.data.data || []
    }
  )

  // Get service history
  const { data: serviceHistory } = useQuery(
    ['serviceHistory', selectedVehicle?.vin],
    () => vehicleAPI.getServiceHistory(selectedVehicle.vin),
    {
      enabled: !!selectedVehicle?.vin && activeTab === 'history',
      select: (response) => response.data.data || []
    }
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchParams.query.length >= 2) {
      refetch()
    }
  }

  const handleClearSearch = () => {
    setSearchParams({ query: '', searchType: 'all' })
    setSelectedCustomer(null)
    setSelectedVehicle(null)
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    if (customer.vehicles && customer.vehicles.length > 0) {
      setSelectedVehicle(customer.vehicles[0])
    }
  }

  const handleSaveNotes = async () => {
    try {
      await vehicleAPI.updateVehicleNotes(selectedVehicle.vin, vehicleNotes)
      // Show success message
    } catch (error) {
      console.error('Error saving notes:', error)
      // Show error message
    }
  }

  useEffect(() => {
    if (vehicleDetails?.notes) {
      setVehicleNotes(vehicleDetails.notes)
    }
  }, [vehicleDetails])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hồ sơ xe & khách hàng</h1>
          <p className="text-gray-600">Tìm kiếm và quản lý thông tin khách hàng và phương tiện</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Đã đồng bộ với hệ thống hãng lúc {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tra cứu khách hàng</h3>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="Nhập VIN / Tên khách hàng / Số điện thoại"
                    value={searchParams.query}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary px-6"
                disabled={searchLoading || searchParams.query.length < 2}
              >
                {searchLoading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>

              {searchParams.query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-secondary px-4"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Search Results */}
          {searchResults && searchResults.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Kết quả tìm kiếm</h4>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Họ tên KH</th>
                      <th>Số điện thoại</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Số VIN</th>
                      <th>Model</th>
                      <th>Năm SX</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((customer) => (
                      <tr key={customer.id}>
                        <td className="font-medium">{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.email}</td>
                        <td className="max-w-xs truncate">{customer.address}</td>
                        <td className="font-mono text-sm">{customer.vehicles?.[0]?.vin}</td>
                        <td>{customer.vehicles?.[0]?.model}</td>
                        <td>{customer.vehicles?.[0]?.productionYear}</td>
                        <td>
                          <button
                            onClick={() => handleSelectCustomer(customer)}
                            className="btn btn-primary btn-sm flex items-center space-x-1"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>Chọn</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {searchResults && searchResults.length === 0 && searchParams.query.length >= 2 && (
            <div className="mt-6 text-center py-8">
              <UserIcon className="mx-auto w-12 h-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Không tìm thấy khách hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer & Vehicle Details */}
      {selectedCustomer && selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedCustomer.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-900">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Thông tin xe chi tiết</h3>
                  {selectedCustomer.vehicles && selectedCustomer.vehicles.length > 1 && (
                    <select
                      className="input w-48"
                      value={selectedVehicle.vin}
                      onChange={(e) => {
                        const vehicle = selectedCustomer.vehicles.find(v => v.vin === e.target.value)
                        setSelectedVehicle(vehicle)
                      }}
                    >
                      {selectedCustomer.vehicles.map((vehicle) => (
                        <option key={vehicle.vin} value={vehicle.vin}>
                          {vehicle.model} - {vehicle.vin}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Vehicle Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">VIN</label>
                    <div className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {selectedVehicle.vin}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedVehicle.model}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
                    <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedVehicle.productionYear}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Màu xe</label>
                    <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedVehicle.color || 'Chưa cập nhật'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Biển số</label>
                    <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedVehicle.licensePlate || 'Chưa cập nhật'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bán</label>
                    <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedVehicle.saleDate ? new Date(selectedVehicle.saleDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'parts', name: 'Phụ tùng', icon: WrenchScrewdriverIcon },
                      { id: 'history', name: 'Lịch sử dịch vụ', icon: ClipboardDocumentListIcon },
                      { id: 'notes', name: 'Ghi chú nội bộ', icon: ClipboardDocumentListIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'parts' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Danh sách phụ tùng</h4>
                      {vehicleParts && vehicleParts.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Tên phụ tùng</th>
                                <th>Số seri</th>
                                <th>Loại</th>
                                <th>Ngày gắn</th>
                                <th>Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vehicleParts.map((part) => (
                                <tr key={part.id}>
                                  <td className="font-medium">{part.name}</td>
                                  <td className="font-mono text-sm">{part.serialNumber}</td>
                                  <td>
                                    <span className={`status-badge ${part.type === 'main' ? 'status-processing' : 'status-pending'
                                      }`}>
                                      {part.type === 'main' ? 'Chính' : 'Phụ'}
                                    </span>
                                  </td>
                                  <td>{new Date(part.installDate).toLocaleDateString('vi-VN')}</td>
                                  <td>
                                    <span className="status-badge status-approved">Hoạt động</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Chưa có thông tin phụ tùng</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Lịch sử dịch vụ & bảo hành</h4>
                      {serviceHistory && serviceHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Ngày thực hiện</th>
                                <th>Loại dịch vụ</th>
                                <th>Hạng mục</th>
                                <th>Phụ tùng thay thế</th>
                                <th>Số serialNumber</th>
                                <th>Kỹ thuật viên</th>
                              </tr>
                            </thead>
                            <tbody>
                              {serviceHistory.map((record) => (
                                <tr key={record.id}>
                                  <td>{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                                  <td>
                                    <span className={`status-badge ${record.type === 'warranty' ? 'status-processing' : 'status-approved'
                                      }`}>
                                      {record.type === 'warranty' ? 'Bảo hành' : 'Bảo dưỡng'}
                                    </span>
                                  </td>
                                  <td>{record.description}</td>
                                  <td>{record.replacedPart || '-'}</td>
                                  <td className="font-mono text-sm">{record.partSerialNumber || '-'}</td>
                                  <td>{record.technician}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Chưa có lịch sử dịch vụ</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Ghi chú nội bộ</h4>
                      <div className="space-y-4">
                        <textarea
                          className="input h-32 resize-none"
                          placeholder="Nhập ghi chú nội bộ cho hồ sơ xe..."
                          value={vehicleNotes}
                          onChange={(e) => setVehicleNotes(e.target.value)}
                          maxLength={500}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {vehicleNotes.length}/500 ký tự
                          </span>
                          <button
                            onClick={handleSaveNotes}
                            className="btn btn-primary btn-sm"
                            disabled={vehicleNotes === vehicleDetails?.notes}
                          >
                            💾 Lưu ghi chú
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">
                          💡 Ghi chú này chỉ hiển thị nội bộ, không gửi cho hãng.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerManagement