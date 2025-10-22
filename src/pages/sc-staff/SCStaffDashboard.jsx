import React from 'react'

export default function SCStaffDashboard() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>SC Staff Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-gray-500 text-sm'>Yêu cầu mới</h3>
          <p className='text-3xl font-bold mt-2'>23</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-gray-500 text-sm'>Đang xử lý</h3>
          <p className='text-3xl font-bold mt-2'>15</p>
        </div>
      </div>
    </div>
  )
}
