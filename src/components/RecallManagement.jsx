import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const RecallManagement = () => {
  const [recalls, setRecalls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecall, setSelectedRecall] = useState(null);

  useEffect(() => {
    // Mock data - Chiến dịch recall từ hãng
    setRecalls([
      {
        id: 'RC-2025-001',
        title: 'Recall Model X - Kiểm tra hệ thống phanh',
        description: 'Kiểm tra và thay thế phanh trước do lỗi sản xuất',
        affectedModels: ['Model X'],
        affectedVINs: ['LVSHGAE4XJ1234567', 'LVSHGAE4XJ1234568'],
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        status: 'active',
        priority: 'high',
        estimatedCost: '5000000',
        customersNotified: 2,
        customersScheduled: 1,
        customersCompleted: 0
      },
      {
        id: 'SC-2025-002',
        title: 'Service Campaign Model Y - Cập nhật phần mềm BMS',
        description: 'Cập nhật phần mềm BMS để tối ưu hiệu suất pin',
        affectedModels: ['Model Y'],
        affectedVINs: ['LVSHGAE4XJ1234569'],
        startDate: '2025-01-15',
        endDate: '2025-06-30',
        status: 'active',
        priority: 'medium',
        estimatedCost: '0',
        customersNotified: 1,
        customersScheduled: 0,
        customersCompleted: 0
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-success',
      completed: 'bg-primary',
      cancelled: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Đang thực hiện',
      completed: 'Hoàn thành',
      cancelled: 'Hủy bỏ'
    };
    return texts[status] || status;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-danger',
      medium: 'bg-warning',
      low: 'bg-info'
    };
    return badges[priority] || 'bg-secondary';
  };

  const handleNotifyCustomers = (recall) => {
    setSelectedRecall(recall);
    setShowModal(true);
  };

  const handleScheduleAppointment = (recall) => {
    // Logic để lên lịch hẹn
    console.log('Schedule appointment for recall:', recall.id);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-bullhorn me-2"></i>Quản lý Recall & Service Campaigns</h2>
        <button className="btn btn-outline-primary">
          <i className="fas fa-sync me-2"></i>Đồng bộ từ hãng
        </button>
      </div>

      <div className="row">
        {recalls.map((recall, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{recall.title}</h6>
                <span className={`badge ${getStatusBadge(recall.status)}`}>
                  {getStatusText(recall.status)}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">{recall.description}</p>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <small className="text-muted">Models:</small><br/>
                    {recall.affectedModels.map(model => (
                      <span key={model} className="badge bg-secondary me-1">{model}</span>
                    ))}
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Độ ưu tiên:</small><br/>
                    <span className={`badge ${getPriorityBadge(recall.priority)}`}>
                      {recall.priority}
                    </span>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-4 text-center">
                    <div className="h5 text-primary">{recall.customersNotified}</div>
                    <small className="text-muted">Đã thông báo</small>
                  </div>
                  <div className="col-4 text-center">
                    <div className="h5 text-warning">{recall.customersScheduled}</div>
                    <small className="text-muted">Đã lên lịch</small>
                  </div>
                  <div className="col-4 text-center">
                    <div className="h5 text-success">{recall.customersCompleted}</div>
                    <small className="text-muted">Hoàn thành</small>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    {recall.startDate} - {recall.endDate}
                  </small>
                  <small className="text-muted">
                    {recall.affectedVINs.length} xe
                  </small>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group w-100" role="group">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleNotifyCustomers(recall)}
                  >
                    <i className="fas fa-bell me-1"></i>Thông báo
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleScheduleAppointment(recall)}
                  >
                    <i className="fas fa-calendar me-1"></i>Lên lịch
                  </button>
                  <button className="btn btn-outline-info btn-sm">
                    <i className="fas fa-chart-bar me-1"></i>Báo cáo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thông báo khách hàng */}
      {showModal && selectedRecall && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thông báo khách hàng - {selectedRecall.title}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Lưu ý:</strong> Thông báo sẽ được gửi qua SMS và Email cho tất cả khách hàng có xe thuộc diện recall.
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nội dung thông báo:</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    defaultValue={`Xin chào quý khách,

Chúng tôi thông báo xe của quý khách thuộc diện ${selectedRecall.title}.

${selectedRecall.description}

Vui lòng liên hệ trung tâm dịch vụ để được hỗ trợ miễn phí.

Trân trọng,
Trung tâm dịch vụ EV`}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h6>Khách hàng sẽ nhận thông báo:</h6>
                        <ul className="list-unstyled">
                          <li><i className="fas fa-user me-2"></i>Nguyễn Văn A - 0901234567</li>
                          <li><i className="fas fa-user me-2"></i>Trần Thị B - 0901234568</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h6>Phương thức gửi:</h6>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <label className="form-check-label">SMS</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <label className="form-check-label">Email</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">Gọi điện</label>
                        </div>
                      </div>
                    </div>
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
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Logic gửi thông báo
                    setShowModal(false);
                  }}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Gửi thông báo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecallManagement;
