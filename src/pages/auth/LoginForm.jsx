import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROLE_HOME_ROUTES } from '../../utils/constants'
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(formData)
    if (result.success) {
      const roleName = result.user?.role?.roleName || result.user?.role || ''
      const roleKey = roleName.replace('ROLE_', '')
      console.log('🔵 Navigating with role:', roleKey, 'to:', ROLE_HOME_ROUTES[roleKey])
      navigate(ROLE_HOME_ROUTES[roleKey] || '/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className={styles.loginContainer}>
      {/* Main Container */}
      <div className={styles.mainCard}>

        {/* Left Side - Background Image */}
        <div className={styles.leftSide}>
          <div className={styles.backgroundImage} />
          <div className={styles.overlay} />

          {/* Geometric Shapes */}
          <div className={styles.geometricShapes}>
            <div className={`${styles.shape} ${styles.shape1}`} />
            <div className={`${styles.shape} ${styles.shape2}`} />
            <div className={`${styles.shape} ${styles.shape3}`} />
          </div>

          {/* Content */}
          <div className={styles.leftContent}>
            <div className={styles.brandCard}>
              <h2 className={styles.brandTitle}>OEM EV Warranty Management System</h2>
              <p className={styles.brandSubtitle}>Phần mềm quản lý bảo hành xe điện từ hãng</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            {/* Welcome Text */}
            <div className={styles.welcomeText}>
              <h1 className={styles.welcomeTitle}>Welcome</h1>
              <p className={styles.welcomeSubtitle}>Log in to your account to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Username Input */}
              <div className={styles.inputGroup}>
                <FaUser className={styles.inputIcon} />
                <input
                  type='text'
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder='awesome@user.com'
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                  type='password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder='••••••••••••••'
                  className={styles.input}
                />
              </div>

              <div className={styles.forgotPassword}>
                <Link to='/forgot-password' className={styles.forgotLink}>
                  Forgot your password?
                </Link>
              </div>
              <button
                type='submit'
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <span className={styles.loadingSpinner}>
                    <svg className={styles.spinner} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
