// Date utilities
export const formatDate = (date, format = 'vi-VN') => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString(format)
}

export const formatDateTime = (date, format = 'vi-VN') => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleString(format)
}

export const formatTime = (date, format = 'vi-VN') => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleTimeString(format)
}

export const getRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const dateObj = new Date(date)
  const diffInSeconds = Math.floor((now - dateObj) / 1000)
  
  if (diffInSeconds < 60) return 'vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  
  return formatDate(date)
}

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatVIN = (vin) => {
  if (!vin) return ''
  return vin.toUpperCase().replace(/(.{4})/g, '$1 ').trim()
}

// Number utilities
export const formatCurrency = (amount, currency = 'VND') => {
  if (amount === null || amount === undefined) return ''
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

export const formatNumber = (number) => {
  if (number === null || number === undefined) return ''
  return new Intl.NumberFormat('vi-VN').format(number)
}

// Validation utilities
export const isValidVIN = (vin) => {
  if (!vin) return false
  // Basic VIN validation - 17 characters, alphanumeric except I, O, Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/
  return vinRegex.test(vin.toUpperCase())
}

export const isValidEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhoneNumber = (phone) => {
  if (!phone) return false
  // Vietnamese phone number validation
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// File utilities
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  if (!filename) return ''
  return filename.split('.').pop().toLowerCase()
}

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  return imageExtensions.includes(getFileExtension(filename))
}

export const isDocumentFile = (filename) => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx']
  return documentExtensions.includes(getFileExtension(filename))
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = (item[key] || 'other').toString()
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal === bVal) return 0
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

export const removeDuplicates = (array, key) => {
  if (!key) return [...new Set(array)]
  
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

// Status utilities
export const getStatusColor = (status) => {
  const statusColors = {
    // Warranty statuses
    'draft': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'submitted': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-gray-100 text-gray-800',
    'parts_received': 'bg-yellow-100 text-yellow-800',
    
    // User statuses
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'suspended': 'bg-red-100 text-red-800',
    
    // Priority levels
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800',
    'normal': 'bg-gray-100 text-gray-800'
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusText = (status) => {
  const statusTexts = {
    'draft': 'Bản nháp',
    'pending': 'Chờ duyệt',
    'submitted': 'Đã gửi',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối',
    'in_progress': 'Đang xử lý',
    'completed': 'Hoàn thành',
    'parts_received': 'Đã nhận phụ tùng',
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'suspended': 'Tạm ngưng',
    'high': 'Cao',
    'medium': 'Trung bình',
    'low': 'Thấp',
    'normal': 'Bình thường'
  }
  
  return statusTexts[status] || status
}

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      console.error('Copy to clipboard failed:', fallbackError)
      return false
    }
  }
}

// Generate unique ID
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'Đã xảy ra lỗi không xác định'
}

export const isNetworkError = (error) => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network Error') ||
         !navigator.onLine
}