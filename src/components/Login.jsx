import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           minHeight: '100vh'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-car-battery fa-3x text-primary mb-3"></i>
                  <h2 className="fw-bold">Hệ thống Bảo hành Xe Điện</h2>
                  <p className="text-muted">Đăng nhập để tiếp tục</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '10px 30px'
                    }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <i className="fas fa-sign-in-alt me-2"></i>
                    )}
                    Đăng nhập
                  </button>
                </form>
                
                <div className="mt-3">
                  <small className="text-muted">Tài khoản demo:</small><br/>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between">
                      <small><strong>admin</strong>/admin123</small>
                      <small className="text-muted">Quản trị viên</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small><strong>evm_staff</strong>/evm123</small>
                      <small className="text-muted">Nhân viên EVM</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small><strong>sc_staff</strong>/sc123</small>
                      <small className="text-muted">Nhân viên SC</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small><strong>sc_technician</strong>/sctech123</small>
                      <small className="text-muted">Kỹ thuật viên SC</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <small><strong>technician</strong>/tech123</small>
                      <small className="text-muted">Kỹ thuật viên</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

