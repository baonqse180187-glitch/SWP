import React, { useState } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const branches = [
  { id: 'hanoi', label: 'Hà Nội' },
  { id: 'hcm', label: 'TP.HCM' },
  { id: 'danang', label: 'Đà Nẵng' },
  { id: 'hue', label: 'Huế' },
  { id: 'nhatrang', label: 'Nha Trang' },
  { id: 'cantho', label: 'Cần Thơ' },
  { id: 'haiphong', label: 'Hải Phòng' }
];

const Login = () => {
  const auth = useAuth() || {};
  const { login } = auth;
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [branch, setBranch] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await (login ? login(formData.username, formData.password, { branch, remember }) : { success: false, error: 'Auth not available' });
      if (result?.success) {
        toast.success('Đăng nhập thành công!');
      } else {
        toast.error(result?.error || 'Lỗi đăng nhập');
      }
    } catch (err) {
      toast.error('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-left">
          <div className="brand">
            <div className="brand-logo">EV</div>
            <div>
              <h3>OEM</h3>
              <div className="brand-sub">Electric Vehicle Warranty System</div>
            </div>
          </div>
          <div>
            <h2 style={{ margin: 0, paddingLeft: '86px', fontSize: 28 }}>Welcome Back!</h2>
            <p style={{ marginTop: 8, paddingLeft: '20px', color: 'rgba(227, 232, 231, 0.9)' }}>
              Sign in to continue to the warranty management.
            </p>
          </div>
        </div>

        <div className="login-right login-card">
          <div className="login-header">
            <h3>LOG IN</h3>
            <div className="login-sub">Sign in to continue</div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <div style={{ marginBottom: 12 }}>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="form-select input-rounded"
              >
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 12, position: 'relative' }}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="form-control input-rounded"
                required
              />
            </div>

            <div style={{ marginBottom: 12, position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-control input-rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="show-password"
              >
                <i className={`fas ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b6b6b', fontSize: 14 }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" style={{ color: '#6b6b6b', textDecoration: 'none', fontSize: 14 }}>Forget password?</a>
            </div>

            <div style={{ marginBottom: 8 }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-login"
              >
                {loading ? <span className="spinner-border spinner-border-sm" /> : 'LOG IN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

