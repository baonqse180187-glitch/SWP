import React, { useState, useEffect } from 'react'
import {
    MagnifyingGlassIcon,
    UserIcon,
    PhoneIcon,
    CarIcon,
    MapPinIcon,
    EyeIcon,
    WrenchScrewdriverIcon,
    ClipboardDocumentListIcon,
    PlusIcon,
    EnvelopeIcon
} from '../components/Icons'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const CustomerSearch = () => {
    const { user, isSCStaff, isEVMStaff } = useAuth()
    const [searchType, setSearchType] = useState(isSCStaff ? 'vin' : isEVMStaff ? 'product' : 'phone')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState([])
    const [activeTab, setActiveTab] = useState(isEVMStaff ? 'product' : 'customer')
    const [showVinRegistration, setShowVinRegistration] = useState(false)
    const [showProductRegistration, setShowProductRegistration] = useState(false)
    const [showCreateWarranty, setShowCreateWarranty] = useState(false)
    const [showWarrantyHistory, setShowWarrantyHistory] = useState(false)
    const [showVehicleDetails, setShowVehicleDetails] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [selectedImages, setSelectedImages] = useState([])
    const [selectedParts, setSelectedParts] = useState([])
    const [showPartSelectionModal, setShowPartSelectionModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [filters, setFilters] = useState({
        warrantyStatus: 'all', // all, active, expired
        vehicleModel: 'all', // all, VF8, VF9
        dealership: 'all', // all, specific dealership
        year: 'all' // all, 2023, 2024
    })

    // State để lưu data từ API
    const [products, setProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [vehicleParts, setVehicleParts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Load data from API when component mounts
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Load products for EVM Staff
                if (isEVMStaff) {
                    const productsData = await api.getProducts()
                    setProducts(productsData.data || [])
                }

                // Load customers
                const customersData = await api.getCustomers()
                setCustomers(customersData.data || [])

                // Load vehicle parts
                const partsData = await api.getVehicleParts()
                setVehicleParts(partsData.data || [])
            } catch (err) {
                setError('Lỗi khi tải dữ liệu từ server')
                console.error('Error loading data:', err)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [isEVMStaff])

    const handleSearch = () => {
        // Tìm kiếm theo loại
        let results = []
        if (searchType === 'product') {
            // Tìm kiếm sản phẩm cho EVM Staff
            results = products.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
        } else if (searchType === 'vin') {
            results = customers.filter(c =>
                c.vehicles.some(v => v.vin.includes(searchQuery))
            )
        } else if (searchType === 'phone') {
            results = customers.filter(c => c.phone.includes(searchQuery))
        } else if (searchType === 'license') {
            results = customers.filter(c =>
                c.vehicles.some(v => v.licensePlate.includes(searchQuery))
            )
        } else if (searchType === 'name') {
            results = customers.filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Áp dụng bộ lọc
        if (searchType !== 'product' && results.length > 0) {
            results = results.filter(customer => {
                return customer.vehicles.some(vehicle => {
                    // Lọc theo trạng thái bảo hành
                    if (filters.warrantyStatus !== 'all') {
                        const isActive = vehicle.warrantyStatus === 'Còn bảo hành'
                        if (filters.warrantyStatus === 'active' && !isActive) return false
                        if (filters.warrantyStatus === 'expired' && isActive) return false
                    }

                    // Lọc theo model xe
                    if (filters.vehicleModel !== 'all') {
                        if (filters.vehicleModel === 'VF8' && !vehicle.model.includes('VF8')) return false
                        if (filters.vehicleModel === 'VF9' && !vehicle.model.includes('VF9')) return false
                    }

                    // Lọc theo đại lý
                    if (filters.dealership !== 'all') {
                        if (!vehicle.dealership.includes(filters.dealership)) return false
                    }

                    // Lọc theo năm sản xuất
                    if (filters.year !== 'all') {
                        if (vehicle.year.toString() !== filters.year) return false
                    }

                    return true
                })
            })
        }

        if (results.length > 0) {
            if (searchType === 'product') {
                setSelectedProducts(results)
                setSelectedCustomer(null)
            } else {
                setSelectedCustomer(results[0])
                setSelectedProducts([])
            }
        }
    }

    const handleCreateWarranty = (vehicle) => {
        setSelectedVehicle(vehicle)
        setShowCreateWarranty(true)
    }

    const handleViewWarrantyHistory = (vehicle) => {
        setSelectedVehicle(vehicle)
        setShowWarrantyHistory(true)
    }

    const handleViewVehicleDetails = (vehicle) => {
        setSelectedVehicle(vehicle)
        setShowVehicleDetails(true)
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEVMStaff ? 'Quản lý sản phẩm & phụ tùng' : 'Quản lý khách hàng & xe'}
                </h1>
                <p className="text-gray-600">
                    {isEVMStaff ? 'Quản lý cơ sở dữ liệu sản phẩm và phụ tùng' : 'Tìm kiếm thông tin khách hàng và phương tiện'}
                </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại tìm kiếm
                        </label>
                        <div className="flex space-x-4">
                            {isEVMStaff && (
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="product"
                                        checked={searchType === 'product'}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="font-medium text-purple-600">Sản phẩm</span>
                                </label>
                            )}
                            {isSCStaff && (
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="vin"
                                        checked={searchType === 'vin'}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="font-medium text-blue-600">Số VIN</span>
                                </label>
                            )}
                            {!isEVMStaff && (
                                <>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="phone"
                                            checked={searchType === 'phone'}
                                            onChange={(e) => setSearchType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Số điện thoại
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="license"
                                            checked={searchType === 'license'}
                                            onChange={(e) => setSearchType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Biển số xe
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="name"
                                            checked={searchType === 'name'}
                                            onChange={(e) => setSearchType(e.target.value)}
                                            className="mr-2"
                                        />
                                        Tên khách hàng
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={`Nhập ${searchType === 'product' ? 'tên sản phẩm hoặc mã sản phẩm' :
                                    searchType === 'vin' ? 'số VIN' :
                                        searchType === 'phone' ? 'số điện thoại' :
                                            searchType === 'license' ? 'biển số xe' : 'tên khách hàng'
                                    }`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Lọc
                        </button>
                        {isSCStaff && (
                            <button
                                onClick={() => setShowVinRegistration(true)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Đăng ký VIN
                            </button>
                        )}
                        {isEVMStaff && (
                            <button
                                onClick={() => setShowProductRegistration(true)}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Thêm sản phẩm
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            {/* Product Results for EVM Staff */}
            {selectedProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Kết quả tìm kiếm sản phẩm ({selectedProducts.length} sản phẩm)
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedProducts.map((product) => (
                                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-500">Mã: {product.code}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Nhà sản xuất:</span>
                                                <span className="font-medium">{product.manufacturer}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Bảo hành:</span>
                                                <span className="font-medium">{product.warrantyPeriod}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Giá:</span>
                                                <span className="font-medium text-green-600">
                                                    {product.price.toLocaleString('vi-VN')} VNĐ
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tồn kho:</span>
                                                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {product.stock} sản phẩm
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700">
                                                    Chỉnh sửa
                                                </button>
                                                <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700">
                                                    Quản lý tồn kho
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Results */}
            {selectedCustomer && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('customer')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'customer'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    Thông tin khách hàng
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('vehicle')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'vehicle'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CarIcon className="h-4 w-4" />
                                    Thông tin xe
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'customer' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Họ tên</p>
                                                    <p className="font-medium">{selectedCustomer.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{selectedCustomer.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                                    <p className="font-medium">{selectedCustomer.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleCreateWarranty(selectedCustomer.vehicles[0])}
                                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                <ClipboardDocumentListIcon className="h-4 w-4" />
                                                Tạo yêu cầu bảo hành
                                            </button>
                                            <button
                                                onClick={() => handleViewWarrantyHistory(selectedCustomer.vehicles[0])}
                                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                                            >
                                                <WrenchScrewdriverIcon className="h-4 w-4" />
                                                Xem lịch sử bảo hành
                                            </button>
                                            <button
                                                onClick={() => handleViewVehicleDetails(selectedCustomer.vehicles[0])}
                                                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'vehicle' && selectedCustomer.vehicles.length > 0 && (
                            <div className="space-y-6">
                                {selectedCustomer.vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                                    {vehicle.model} - {vehicle.licensePlate}
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-500">Biển số: </span>
                                                        <span className="font-medium">{vehicle.licensePlate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Model: </span>
                                                        <span className="font-medium">{vehicle.model}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Màu sắc: </span>
                                                        <span className="font-medium">{vehicle.color}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Năm sản xuất: </span>
                                                        <span className="font-medium">{vehicle.year}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">VIN: </span>
                                                        <span className="font-medium font-mono text-xs">{vehicle.vin}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin bảo hành</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-500">Trạng thái: </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {vehicle.warrantyStatus}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">Hết hạn: </span>
                                                        <span className="font-medium">{vehicle.warrantyExpiry}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    <button
                                                        onClick={() => handleCreateWarranty(vehicle)}
                                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                                    >
                                                        Tạo yêu cầu bảo hành cho xe này
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewWarrantyHistory(vehicle)}
                                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                                    >
                                                        Xem lịch sử bảo hành
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewVehicleDetails(vehicle)}
                                                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                                                    >
                                                        Xem chi tiết xe
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Product Registration Modal */}
            {showProductRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
                            <button
                                onClick={() => setShowProductRegistration(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VF8-BATTERY-002"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Pin Lithium VF8"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Chọn danh mục</option>
                                    <option value="Pin xe điện">Pin xe điện</option>
                                    <option value="Động cơ điện">Động cơ điện</option>
                                    <option value="Phụ kiện sạc">Phụ kiện sạc</option>
                                    <option value="Phụ tùng thân vỏ">Phụ tùng thân vỏ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="200000000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thời gian bảo hành
                                </label>
                                <input
                                    type="text"
                                    placeholder="8 năm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng tồn kho
                                </label>
                                <input
                                    type="number"
                                    placeholder="50"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowProductRegistration(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    alert('Thêm sản phẩm thành công!')
                                    setShowProductRegistration(false)
                                }}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Thêm sản phẩm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIN Registration Modal */}
            {showVinRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Đăng ký VIN mới</h3>
                            <button
                                onClick={() => setShowVinRegistration(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số VIN <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập số VIN"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Model xe <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Chọn model</option>
                                    <option value="VF8">VinFast VF8</option>
                                    <option value="VF9">VinFast VF9</option>
                                    <option value="VFe34">VinFast VFe34</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Năm sản xuất <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="2020"
                                    max="2025"
                                    placeholder="2024"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Màu xe
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập màu xe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowVinRegistration(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    alert('Đăng ký VIN thành công!')
                                    setShowVinRegistration(false)
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Đăng ký VIN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Warranty Modal */}
            {showCreateWarranty && selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] p-6 overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Tạo Yêu Cầu Bảo Hành</h3>
                            <button
                                onClick={() => {
                                    setShowCreateWarranty(false)
                                    setSelectedImages([])
                                    setSelectedParts([])
                                }}
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
                                            value={selectedVehicle.vin}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* Model xe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Model xe
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedVehicle.model}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* Biển số */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Biển số xe
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedVehicle.licensePlate}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 outline-none"
                                            disabled
                                        />
                                    </div>

                                    {/* Màu sắc */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Màu sắc
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedVehicle.color}
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
                                            value={selectedCustomer.name}
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
                                            value={selectedCustomer.phone}
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
                                            id="customer-warranty-images"
                                            onChange={handleImageUpload}
                                        />
                                        <label
                                            htmlFor="customer-warranty-images"
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
                                    onClick={() => {
                                        setShowCreateWarranty(false)
                                        setSelectedImages([])
                                        setSelectedParts([])
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('Yêu cầu bảo hành đã được tạo thành công! Yêu cầu sẽ được gửi lên hãng để duyệt.')
                                        setShowCreateWarranty(false)
                                        setSelectedImages([])
                                        setSelectedParts([])
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

            {/* Warranty History Modal */}
            {showWarrantyHistory && selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Lịch sử bảo hành</h3>
                            <button
                                onClick={() => setShowWarrantyHistory(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Thông tin xe</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Model:</span> {selectedVehicle.model}
                                </div>
                                <div>
                                    <span className="text-gray-500">Biển số:</span> {selectedVehicle.licensePlate}
                                </div>
                                <div>
                                    <span className="text-gray-500">VIN:</span> {selectedVehicle.vin}
                                </div>
                                <div>
                                    <span className="text-gray-500">Chủ xe:</span> {selectedCustomer.name}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium">
                                Tổng số lần bảo hành: {selectedVehicle.warrantyHistory?.length || 0}
                            </h4>

                            {selectedVehicle.warrantyHistory && selectedVehicle.warrantyHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedVehicle.warrantyHistory.map((history) => (
                                        <div key={history.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{history.type}</h5>
                                                    <p className="text-sm text-gray-500">Ngày: {history.date}</p>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${history.status === 'Hoàn thành'
                                                    ? 'bg-green-100 text-green-800'
                                                    : history.status === 'Đang xử lý'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {history.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{history.description}</p>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Kỹ thuật viên: {history.technician}
                                                </span>
                                                <span className="text-gray-500">
                                                    Chi phí: {history.cost === 0 ? 'Miễn phí (BH)' : history.cost.toLocaleString('vi-VN') + ' VNĐ'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Chưa có lịch sử bảo hành nào</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowWarrantyHistory(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Details Modal */}
            {showVehicleDetails && selectedVehicle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Chi tiết thông tin xe và chủ sở hữu</h3>
                            <button
                                onClick={() => setShowVehicleDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vehicle Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin xe</h4>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Model:</span>
                                        <span className="font-medium">{selectedVehicle.model}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Biển số:</span>
                                        <span className="font-medium">{selectedVehicle.licensePlate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Màu sắc:</span>
                                        <span className="font-medium">{selectedVehicle.color}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Năm sản xuất:</span>
                                        <span className="font-medium">{selectedVehicle.year}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">VIN:</span>
                                        <span className="font-medium font-mono text-xs">{selectedVehicle.vin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ngày mua:</span>
                                        <span className="font-medium">{selectedVehicle.purchaseDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Đại lý:</span>
                                        <span className="font-medium">{selectedVehicle.dealership}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Trạng thái BH:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedVehicle.warrantyStatus === 'Còn bảo hành'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {selectedVehicle.warrantyStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Hết hạn BH:</span>
                                        <span className="font-medium">{selectedVehicle.warrantyExpiry}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Thông tin chủ sở hữu</h4>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Họ tên</p>
                                            <p className="font-medium">{selectedCustomer.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-medium">{selectedCustomer.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedCustomer.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Địa chỉ</p>
                                            <p className="font-medium">{selectedCustomer.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Vehicle Actions */}
                                <div className="mt-6 space-y-3">
                                    <h5 className="font-medium text-gray-900">Thao tác</h5>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setShowVehicleDetails(false)
                                                handleCreateWarranty(selectedVehicle)
                                            }}
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            Tạo yêu cầu bảo hành
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowVehicleDetails(false)
                                                handleViewWarrantyHistory(selectedVehicle)
                                            }}
                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            Xem lịch sử bảo hành
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowVehicleDetails(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Parts Selection Modal for Create Warranty */}
            {showPartSelectionModal && (
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
                </div>
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Bộ lọc tìm kiếm</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Trạng thái bảo hành */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái bảo hành
                                </label>
                                <select
                                    value={filters.warrantyStatus}
                                    onChange={(e) => setFilters(prev => ({ ...prev, warrantyStatus: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="active">Còn bảo hành</option>
                                    <option value="expired">Hết bảo hành</option>
                                </select>
                            </div>

                            {/* Model xe */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model xe
                                </label>
                                <select
                                    value={filters.vehicleModel}
                                    onChange={(e) => setFilters(prev => ({ ...prev, vehicleModel: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="VF8">VinFast VF8</option>
                                    <option value="VF9">VinFast VF9</option>
                                </select>
                            </div>

                            {/* Năm sản xuất */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Năm sản xuất
                                </label>
                                <select
                                    value={filters.year}
                                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                </select>
                            </div>

                            {/* Đại lý */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đại lý
                                </label>
                                <select
                                    value={filters.dealership}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dealership: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="Quận 1">VinFast Quận 1</option>
                                    <option value="Quận 2">VinFast Quận 2</option>
                                    <option value="Quận 3">VinFast Quận 3</option>
                                    <option value="Quận 7">VinFast Quận 7</option>
                                    <option value="Quận 9">VinFast Quận 9</option>
                                    <option value="Bình Thạnh">VinFast Bình Thạnh</option>
                                    <option value="Tân Bình">VinFast Tân Bình</option>
                                    <option value="Phú Nhuận">VinFast Phú Nhuận</option>
                                    <option value="Gò Vấp">VinFast Gò Vấp</option>
                                    <option value="Thủ Đức">VinFast Thủ Đức</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setFilters({
                                        warrantyStatus: 'all',
                                        vehicleModel: 'all',
                                        dealership: 'all',
                                        year: 'all'
                                    })
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Xóa bộ lọc
                            </button>
                            <button
                                onClick={() => {
                                    setShowFilterModal(false)
                                    if (searchQuery) {
                                        handleSearch() // Áp dụng lại tìm kiếm với bộ lọc mới
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomerSearch