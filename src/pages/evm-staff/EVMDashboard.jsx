import React from 'react'

export default function EVMDashboard() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>EVM Staff Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-gray-500 text-sm'>Chiến dịch đang chạy</h3>
          <p className='text-3xl font-bold mt-2'>12</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-gray-500 text-sm'>Chờ phê duyệt</h3>
          <p className='text-3xl font-bold mt-2'>8</p>
        </div>
      </div>
    </div>
  )
}
