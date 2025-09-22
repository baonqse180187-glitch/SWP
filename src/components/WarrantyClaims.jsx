import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const WarrantyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formData, setFormData] = useState({
    vin: '',
    customerName: '',
    customerPhone: '',
    issueDescription: '',
    partAffected: '',
    partSerial: '',
    mileage: '',
    purchaseDate: '',
    symptoms: '',
    priority: 'medium',
    diagnosis: '',
    estimatedCost: '',
    attachments: []
  });

  // Mock data - Danh sách xe có sẵn trong hệ thống
  const [vehicles] = useState([
    { vin: 'LVSHGAE4XJ1234567', model: 'Model X', customerName: 'Nguyễn Văn A', customerPhone: '0901234567' },
    { vin: 'LVSHGAE4XJ1234568', model: 'Model Y', customerName: 'Trần Thị B', customerPhone: '0901234568' },
    { vin: 'LVSHGAE4XJ1234569', model: 'Model Z', customerName: 'Lê Văn C', customerPhone: '0901234569' }
  ]);

  // Mock data - Phụ tùng có sẵn từ hãng
  const [availableParts] = useState([
    { id: 'BAT-001', name: 'Battery Pack 75kWh', serial: 'BAT-75K-2025-001', status: 'available' },
    { id: 'BMS-001', name: 'BMS Module', serial: 'BMS-MOD-2025-001', status: 'available' },
    { id: 'MOT-001', name: 'Motor 300kW', serial: 'MOT-300K-2025-001', status: 'available' },
    { id: 'CHG-001', name: 'Charger 11kW', serial: 'CHG-11K-2025-001', status: 'available' }
  ]);

  useEffect(() => {
    // Mock data - Yêu cầu bảo hành
    setClaims([
      {
        id: 'WC-20250115-001',
        vin: 'LVSHGAE4XJ1234567',
        model: 'Model X',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        issueDescription: 'Pin không sạc được, hiển thị lỗi BMS',
        partAffected: 'Battery Pack',
        partSerial: 'BAT-75K-2024-123',
        status: 'pending_approval',
        priority: 'high',
        createdAt: '2025-01-15',
        assignedTo: null,
        diagnosis: 'BMS báo lỗi cell imbalance, cần thay thế battery pack',
        estimatedCost: '150000000',
        attachments: ['diagnosis_report.pdf', 'error_screenshot.jpg'],
        canEdit: true
      },
      {
        id: 'WC-20250114-002',
        vin: 'LVSHGAE4XJ1234568',
        model: 'Model Y',
        customerName: 'Trần Thị B',
        customerPhone: '0901234568',
        issueDescription: 'Động cơ phát ra tiếng ồn bất thường',
        partAffected: 'Motor',
        partSerial: 'MOT-300K-2024-456',
        status: 'approved',
        priority: 'medium',
        createdAt: '2025-01-14',
        assignedTo: 'technician',
        diagnosis: 'Bearing motor bị mòn, cần thay thế',
        estimatedCost: '25000000',
        attachments: ['noise_analysis.pdf'],
        canEdit: false
      },
      {
        id: 'WC-20250113-003',
        vin: 'LVSHGAE4XJ1234569',
        model: 'Model Z',
        customerName: 'Lê Văn C',
        customerPhone: '0901234569',
        issueDescription: 'Hệ thống điều hòa không hoạt động',
        partAffected: 'HVAC System',
        partSerial: 'HVAC-2024-789',
        status: 'in_progress',
        priority: 'low',
        createdAt: '2025-01-13',
        assignedTo: 'technician',
        diagnosis: 'Compressor bị hỏng',
        estimatedCost: '12000000',
        attachments: ['hvac_test.pdf'],
        canEdit: false
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending_approval: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger',
      in_progress: 'bg-info',
      completed: 'bg-primary',
      parts_received: 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      pending_approval: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      in_progress: 'Đang xử lý',
      completed: 'Hoàn thành',
      parts_received: 'Đã nhận phụ tùng'
    };
    return texts[status] || status;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-danger',
      medium: 'bg-warning',
      low: 'bg-success'
    };
    return badges[priority] || 'bg-secondary';
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return texts[priority] || priority;
  };

  const handleCreateClaim = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `WC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(claims.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'pending_approval',
      createdAt: new Date().toISOString().slice(0, 10),
      assignedTo: null,
      canEdit: true
    };
    setClaims([newClaim, ...claims]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditClaim = (claim) => {
    setSelectedClaim(claim);
    setFormData({
      vin: claim.vin,
      customerName: claim.customerName,
      customerPhone: claim.customerPhone,
      issueDescription: claim.issueDescription,
      partAffected: claim.partAffected,
      partSerial: claim.partSerial,
      mileage: claim.mileage,
      purchaseDate: claim.purchaseDate,
      symptoms: claim.symptoms,
      priority: claim.priority,
      diagnosis: claim.diagnosis,
      estimatedCost: claim.estimatedCost,
      attachments: claim.attachments
    });
    setShowEditModal(true);
  };

  const handleUpdateClaim = (e) => {
    e.preventDefault();
    setClaims(claims.map(claim => 
      claim.id === selectedClaim.id 
        ? { ...claim, ...formData, updatedAt: new Date().toISOString().slice(0, 10) }
        : claim
    ));
    setShowEditModal(false);
    resetForm();
  };

  const updateClaimStatus = (claimId, newStatus) => {
    setClaims(claims.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status: newStatus, 
            assignedTo: newStatus === 'in_progress' ? user?.username : claim.assignedTo,
            updatedAt: new Date().toISOString().slice(0, 10)
          }
        : claim
    ));
  };

  const resetForm = () => {
    setFormData({
      vin: '',
      customerName: '',
      customerPhone: '',
      issueDescription: '',
      partAffected: '',
      partSerial: '',
      mileage: '',
      purchaseDate: '',
      symptoms: '',
      priority: 'medium',
      diagnosis: '',
      estimatedCost: '',
      attachments: []
    });
  };

  const canCreateClaim = () => {
    return ['admin', 'sc_staff', 'sc_technician'].includes(user?.role);
  };

  const canEditClaim = (claim) => {
    return ['admin', 'sc_staff'].includes(user?.role) && claim.canEdit && claim.status === 'pending_approval';
  };

  const canApproveClaim = (claim) => {
    return ['admin', 'evm_staff'].includes(user?.role) && claim.status === 'pending_approval';
  };

  const canUpdateClaim = (claim) => {
    return ['admin', 'sc_technician'].includes(user?.role) && ['approved', 'parts_received', 'in_progress'].includes(claim.status);
  };

  const handleVinChange = (vin) => {
    const vehicle = vehicles.find(v => v.vin === vin);
    if (vehicle) {
      setFormData({
        ...formData,
        vin: vin,
        customerName: vehicle.customerName,
        customerPhone: vehicle.customerPhone
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-clipboard-list me-2"></i>Yêu cầu Bảo hành</h2>
        {canCreateClaim() && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '25px'
            }}
          >
            <i className="fas fa-plus me-2"></i>Tạo Yêu cầu mới
          </button>
        )}
      </div>

      {/* Filter và Search */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending_approval">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option value="">Tất cả độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Tìm kiếm theo VIN, tên khách hàng..."
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-primary w-100">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Mã yêu cầu</th>
                  <th>VIN</th>
                  <th>Khách hàng</th>
                  <th>Vấn đề</th>
                  <th>Phụ tùng</th>
                  <th>Số seri</th>
                  <th>Độ ưu tiên</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr key={index}>
                    <td><code>{claim.id}</code></td>
                    <td><code>{claim.vin}</code></td>
                    <td>
                      <div>
                        <strong>{claim.customerName}</strong><br/>
                        <small className="text-muted">{claim.customerPhone}</small>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px' }}>
                        <small>{claim.issueDescription}</small>
                      </div>
                    </td>
                    <td><span className="badge bg-secondary">{claim.partAffected}</span></td>
                    <td><code>{claim.partSerial}</code></td>
                    <td>
                      <span className={`badge ${getPriorityBadge(claim.priority)}`}>
                        {getPriorityText(claim.priority)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td>{claim.createdAt}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        
                        {canEditClaim(claim) && (
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEditClaim(claim)}
                            title="Sửa yêu cầu"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        
                        {canApproveClaim(claim) && (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => updateClaimStatus(claim.id, 'approved')}
                              title="Duyệt"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => updateClaimStatus(claim.id, 'rejected')}
                              title="Từ chối"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                        
                        {canUpdateClaim(claim) && (
                          <>
                            {claim.status === 'approved' && (
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => updateClaimStatus(claim.id, 'parts_received')}
                                title="Đã nhận phụ tùng"
                              >
                                <i className="fas fa-box"></i>
                              </button>
                            )}
                            {claim.status === 'parts_received' && (
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => updateClaimStatus(claim.id, 'in_progress')}
                                title="Bắt đầu sửa chữa"
                              >
                                <i className="fas fa-tools"></i>
                              </button>
                            )}
                            {claim.status === 'in_progress' && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => updateClaimStatus(claim.id, 'completed')}
                                title="Hoàn thành"
                              >
                                <i className="fas fa-check-circle"></i>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal tạo yêu cầu bảo hành mới */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo yêu cầu bảo hành mới</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateClaim}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">VIN xe *</label>
                      <select
                        className="form-select"
                        value={formData.vin}
                        onChange={(e) => handleVinChange(e.target.value)}
                        required
                      >
                        <option value="">Chọn VIN xe</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.vin} value={vehicle.vin}>
                            {vehicle.vin} - {vehicle.model} - {vehicle.customerName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên khách hàng *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.customerName}
                        readOnly
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số điện thoại *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.customerPhone}
                        readOnly
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số km đã đi</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.mileage}
                        onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                        placeholder="km"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày mua xe</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Độ ưu tiên</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      >
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phụ tùng bị ảnh hưởng *</label>
                      <select
                        className="form-select"
                        value={formData.partAffected}
                        onChange={(e) => setFormData({...formData, partAffected: e.target.value})}
                        required
                      >
                        <option value="">Chọn phụ tùng</option>
                        <option value="Battery Pack">Pin (Battery Pack)</option>
                        <option value="BMS">BMS (Battery Management System)</option>
                        <option value="Motor">Động cơ</option>
                        <option value="Charger">Bộ sạc</option>
                        <option value="ECU">ECU (Electronic Control Unit)</option>
                        <option value="HVAC System">Hệ thống điều hòa</option>
                        <option value="Brake System">Hệ thống phanh</option>
                        <option value="Suspension">Hệ thống treo</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số seri phụ tùng *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.partSerial}
                        onChange={(e) => setFormData({...formData, partSerial: e.target.value})}
                        placeholder="Nhập số seri phụ tùng"
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Mô tả vấn đề *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.issueDescription}
                        onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                        placeholder="Mô tả chi tiết vấn đề gặp phải..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Triệu chứng</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.symptoms}
                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                        placeholder="Mô tả các triệu chứng, âm thanh, cảnh báo..."
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Chẩn đoán kỹ thuật *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        placeholder="Kết quả chẩn đoán, nguyên nhân, giải pháp..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Chi phí ước tính (VNĐ)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Đính kèm tài liệu</label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <small className="text-muted">Hỗ trợ: PDF, JPG, PNG, DOC (tối đa 10MB mỗi file)</small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane me-2"></i>
                    Gửi yêu cầu lên hãng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa yêu cầu bảo hành */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sửa yêu cầu bảo hành - {selectedClaim?.id}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateClaim}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Bạn chỉ có thể sửa yêu cầu khi đang ở trạng thái "Chờ duyệt"
                  </div>
                  {/* Form tương tự như tạo mới nhưng với dữ liệu đã có */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">VIN xe *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.vin}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên khách hàng *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.customerName}
                        readOnly
                      />
                    </div>
                    {/* Các trường khác có thể sửa */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Mô tả vấn đề *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.issueDescription}
                        onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Chẩn đoán kỹ thuật *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Chi phí ước tính (VNĐ)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Cập nhật yêu cầu
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

export default WarrantyClaims;
