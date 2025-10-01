import React, { useState, useEffect } from 'react';

const WarrantyApproval = () => {
  const [claims, setClaims] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });

  // thêm state cho modal lịch sử
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySc, setHistorySc] = useState('');

  useEffect(() => {
    // Mock data - Yêu cầu bảo hành từ các SC
    setClaims([
      {
        id: 'WC-20250115-001',
        vin: 'LVSHGAE4XJ1234567',
        model: 'Model X',
        scName: 'SC Hà Nội',
        customerName: 'Nguyễn Văn A',
        issueDescription: 'Pin không sạc được, hiển thị lỗi BMS',
        partAffected: 'Battery Pack',
        partSerial: 'BAT-75K-2024-123',
        diagnosis: 'BMS báo lỗi cell imbalance, cần thay thế battery pack',
        estimatedCost: 150000000,
        actualCost: 0,
        status: 'pending_approval',
        priority: 'high',
        createdAt: '2025-01-15',
        submittedBy: 'sc_staff',
        attachments: ['diagnosis_report.pdf', 'error_screenshot.jpg'],
        warrantyPolicy: 'WP-001',
        isWarrantyCovered: true,
        approvalNotes: ''
      },
      {
        id: 'WC-20250114-002',
        vin: 'LVSHGAE4XJ1234568',
        model: 'Model Y',
        scName: 'SC TP.HCM',
        customerName: 'Trần Thị B',
        issueDescription: 'Động cơ phát ra tiếng ồn bất thường',
        partAffected: 'Motor',
        partSerial: 'MOT-300K-2024-456',
        diagnosis: 'Bearing motor bị mòn, cần thay thế',
        estimatedCost: 25000000,
        actualCost: 0,
        status: 'approved',
        priority: 'medium',
        createdAt: '2025-01-14',
        submittedBy: 'sc_staff',
        attachments: ['noise_analysis.pdf'],
        warrantyPolicy: 'WP-002',
        isWarrantyCovered: true,
        approvalNotes: 'Đã duyệt, gửi phụ tùng thay thế'
      },
      {
        id: 'WC-20250113-003',
        vin: 'LVSHGAE4XJ1234569',
        model: 'Model Z',
        scName: 'SC Đà Nẵng',
        customerName: 'Lê Văn C',
        issueDescription: 'Hệ thống điều hòa không hoạt động',
        partAffected: 'HVAC System',
        partSerial: 'HVAC-2024-789',
        diagnosis: 'Compressor bị hỏng do sử dụng sai cách',
        estimatedCost: 12000000,
        actualCost: 0,
        status: 'rejected',
        priority: 'low',
        createdAt: '2025-01-13',
        submittedBy: 'sc_staff',
        attachments: ['hvac_test.pdf'],
        warrantyPolicy: 'WP-003',
        isWarrantyCovered: false,
        approvalNotes: 'Không thuộc diện bảo hành do sử dụng sai cách'
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending_approval: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger',
      in_progress: 'bg-info',
      completed: 'bg-primary'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      pending_approval: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      in_progress: 'Đang xử lý',
      completed: 'Hoàn thành'
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

  const handleApproveClaim = (claimId, approved, notes = '') => {
    setClaims(claims.map(claim =>
      claim.id === claimId
        ? {
          ...claim,
          status: approved ? 'approved' : 'rejected',
          approvalNotes: notes,
          approvedAt: new Date().toISOString().slice(0, 10),
          approvedBy: 'evm_staff'
        }
        : claim
    ));
  };

  const handleViewDetail = (claim) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  // hàm mở modal lịch sử theo tên SC
  const handleViewHistory = (scName) => {
    setHistorySc(scName);
    setShowHistoryModal(true);
  };

  const filteredClaims = claims.filter(claim => {
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.priority && claim.priority !== filters.priority) return false;
    if (filters.dateFrom && claim.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && claim.createdAt > filters.dateTo) return false;
    return true;
  });

  const getTotalCost = () => {
    return claims
      .filter(claim => claim.status === 'approved' || claim.status === 'completed')
      .reduce((total, claim) => total + (claim.actualCost || claim.estimatedCost), 0);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-clipboard-check me-2"></i>Quản lý Yêu cầu Bảo hành</h2>
        <div className="text-end">
          <div className="h4 text-primary">{getTotalCost().toLocaleString()} VNĐ</div>
          <small className="text-muted">Tổng chi phí bảo hành</small>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{claims.filter(c => c.status === 'pending_approval').length}</h4>
              <p className="mb-0">Chờ duyệt</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{claims.filter(c => c.status === 'approved').length}</h4>
              <p className="mb-0">Đã duyệt</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h4>{claims.filter(c => c.status === 'rejected').length}</h4>
              <p className="mb-0">Từ chối</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{claims.filter(c => c.status === 'completed').length}</h4>
              <p className="mb-0">Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending_approval">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">Tất cả độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="Từ ngày"
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder="Đến ngày"
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setFilters({ status: '', priority: '', dateFrom: '', dateTo: '' })}
          >
            <i className="fas fa-times"></i> Xóa lọc
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
                  <th>SC</th>
                  <th>Khách hàng</th>
                  <th>Vấn đề</th>
                  <th>Chi phí</th>
                  <th>Độ ưu tiên</th>
                  <th>Trạng thái</th>
                  <th>Bảo hành</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim, index) => (
                  <tr key={index}>
                    <td><code>{claim.id}</code></td>
                    <td><code>{claim.vin}</code></td>
                    <td>{claim.scName}</td>
                    <td>{claim.customerName}</td>
                    <td>
                      <div style={{ maxWidth: '200px' }}>
                        <small>{claim.issueDescription}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{claim.estimatedCost.toLocaleString()}</strong>
                        {claim.actualCost > 0 && (
                          <div><small className="text-success">Thực tế: {claim.actualCost.toLocaleString()}</small></div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadge(claim.priority)}`}>
                        {claim.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${claim.isWarrantyCovered ? 'bg-success' : 'bg-danger'}`}>
                        {claim.isWarrantyCovered ? 'Có' : 'Không'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetail(claim)}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>

                        {claim.status === 'pending_approval' && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleApproveClaim(claim.id, true)}
                              title="Duyệt"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleApproveClaim(claim.id, false)}
                              title="Từ chối"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}

                        {/* Nút mở lịch sử bảo hành của SC */}
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleViewHistory(claim.scName)}
                          title="Lịch sử bảo hành SC"
                        >
                          <i className="fas fa-history"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal chi tiết yêu cầu */}
      {showDetailModal && selectedClaim && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết yêu cầu bảo hành - {selectedClaim.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Thông tin xe & khách hàng</h6>
                    <table className="table table-sm">
                      <tr><td><strong>VIN:</strong></td><td><code>{selectedClaim.vin}</code></td></tr>
                      <tr><td><strong>Model:</strong></td><td>{selectedClaim.model}</td></tr>
                      <tr><td><strong>Khách hàng:</strong></td><td>{selectedClaim.customerName}</td></tr>
                      <tr><td><strong>SC:</strong></td><td>{selectedClaim.scName}</td></tr>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Thông tin yêu cầu</h6>
                    <table className="table table-sm">
                      <tr><td><strong>Ngày tạo:</strong></td><td>{selectedClaim.createdAt}</td></tr>
                      <tr><td><strong>Độ ưu tiên:</strong></td><td><span className={`badge ${getPriorityBadge(selectedClaim.priority)}`}>{selectedClaim.priority}</span></td></tr>
                      <tr><td><strong>Trạng thái:</strong></td><td><span className={`badge ${getStatusBadge(selectedClaim.status)}`}>{getStatusText(selectedClaim.status)}</span></td></tr>
                      <tr><td><strong>Bảo hành:</strong></td><td><span className={`badge ${selectedClaim.isWarrantyCovered ? 'bg-success' : 'bg-danger'}`}>{selectedClaim.isWarrantyCovered ? 'Có' : 'Không'}</span></td></tr>
                    </table>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Mô tả vấn đề</h6>
                    <p>{selectedClaim.issueDescription}</p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6>Chẩn đoán kỹ thuật</h6>
                    <p>{selectedClaim.diagnosis}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Phụ tùng & Chi phí</h6>
                    <table className="table table-sm">
                      <tr><td><strong>Phụ tùng:</strong></td><td>{selectedClaim.partAffected}</td></tr>
                      <tr><td><strong>Số seri:</strong></td><td><code>{selectedClaim.partSerial}</code></td></tr>
                      <tr><td><strong>Chi phí ước tính:</strong></td><td>{selectedClaim.estimatedCost.toLocaleString()} VNĐ</td></tr>
                      {selectedClaim.actualCost > 0 && (
                        <tr><td><strong>Chi phí thực tế:</strong></td><td>{selectedClaim.actualCost.toLocaleString()} VNĐ</td></tr>
                      )}
                    </table>
                  </div>
                </div>

                {selectedClaim.attachments && selectedClaim.attachments.length > 0 && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6>Tài liệu đính kèm</h6>
                      <div className="list-group">
                        {selectedClaim.attachments.map((file, index) => (
                          <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span><i className="fas fa-file me-2"></i>{file}</span>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedClaim.approvalNotes && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h6>Ghi chú duyệt</h6>
                      <div className="alert alert-info">
                        {selectedClaim.approvalNotes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
                {selectedClaim.status === 'pending_approval' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        handleApproveClaim(selectedClaim.id, true);
                        setShowDetailModal(false);
                      }}
                    >
                      <i className="fas fa-check me-2"></i>Duyệt
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        handleApproveClaim(selectedClaim.id, false);
                        setShowDetailModal(false);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch sử bảo hành của SC */}
      {showHistoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lịch sử bảo hành - {historySc}</h5>
                <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">Hiển thị tất cả yêu cầu bảo hành đã ghi nhận cho nhân viên trung tâm: <strong>{historySc}</strong></p>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Mã</th>
                        <th>Ngày</th>
                        <th>Khách hàng</th>
                        <th>Model</th>
                        <th>Chi phí</th>
                        <th>Trạng thái</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims
                        .filter(c => c.scName === historySc)
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((c) => (
                          <tr key={c.id}>
                            <td><code>{c.id}</code></td>
                            <td>{c.createdAt}</td>
                            <td>{c.customerName}</td>
                            <td>{c.model}</td>
                            <td>{(c.actualCost || c.estimatedCost).toLocaleString()} VNĐ</td>
                            <td><span className={`badge ${getStatusBadge(c.status)}`}>{getStatusText(c.status)}</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => { handleViewDetail(c); setShowHistoryModal(false); }}>
                                Xem
                              </button>
                            </td>
                          </tr>
                        ))}
                      {claims.filter(c => c.scName === historySc).length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">Chưa có yêu cầu bảo hành</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyApproval;
