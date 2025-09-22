import React, { useState, useEffect } from 'react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vin: '',
    model: '',
    year: '',
    color: '',
    batteryType: '',
    batteryCapacity: '',
    motorPower: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryDate: '',
    dealer: ''
  });

  useEffect(() => {
    // Mock data
    setVehicles([
      {
        id: 1,
        vin: 'LVSHGAE4XJ1234567',
        model: 'Model X',
        year: 2025,
        color: 'Xanh',
        batteryType: 'Li-ion',
        batteryCapacity: '75 kWh',
        motorPower: '300 kW',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        customerEmail: 'nguyenvana@email.com',
        deliveryDate: '2025-01-10',
        dealer: 'EV Dealer Hà Nội',
        warrantyStatus: 'Active'
      }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = {
      id: vehicles.length + 1,
      ...formData,
      warrantyStatus: 'Active'
    };
    setVehicles([...vehicles, newVehicle]);
    setShowModal(false);
    setFormData({
      vin: '',
      model: '',
      year: '',
      color: '',
      batteryType: '',
      batteryCapacity: '',
      motorPower: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      deliveryDate: '',
      dealer: ''
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý xe</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Đăng ký xe mới
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>VIN</th>
                  <th>Model</th>
                  <th>Năm</th>
                  <th>Khách hàng</th>
                  <th>Đại lý</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.vin}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.customerName}</td>
                    <td>{vehicle.dealer}</td>
                    <td>
                      <span className={`badge ${vehicle.warrantyStatus === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {vehicle.warrantyStatus}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-warning">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal đăng ký xe mới */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Đăng ký xe mới</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">VIN *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.vin}
                        onChange={(e) => setFormData({...formData, vin: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Model *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Năm sản xuất *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Màu sắc</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Loại pin</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.batteryType}
                        onChange={(e) => setFormData({...formData, batteryType: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dung lượng pin</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.batteryCapacity}
                        onChange={(e) => setFormData({...formData, batteryCapacity: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Công suất động cơ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.motorPower}
                        onChange={(e) => setFormData({...formData, motorPower: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày giao xe</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên khách hàng *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Đại lý</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dealer}
                        onChange={(e) => setFormData({...formData, dealer: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
