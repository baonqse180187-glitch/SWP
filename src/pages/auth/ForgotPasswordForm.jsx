import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FaEnvelope, FaLock, FaPaperPlane, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'
import styles from './css/ForgotPasswordForm.module.css'

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)
    const result = await forgotPassword(email)
    if (result.success) {
      setMessage({ type: 'success', text: 'Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.' })
      setEmail('')
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra. Vui lòng thử lại.' })
    }
    setLoading(false)
  }

  return (
    <div className={styles.forgotContainer}>
      {/* Main Container */}
      <div className={styles.mainCard}>

        {/* Left Side - Illustration */}
        <div className={styles.leftSide}>
          {/* Decorative Circles */}
          <div className={`${styles.decorativeCircle} ${styles.circle1}`} />
          <div className={`${styles.decorativeCircle} ${styles.circle2}`} />
          <div className={`${styles.decorativeCircle} ${styles.circle3}`} />

          {/* Lock Icon */}
          <div className={styles.iconContainer}>
            <FaLock className={styles.lockIcon} />
          </div>

          {/* Content */}
          <div className={styles.leftContent}>
            <h2 className={styles.leftTitle}>Quên mật khẩu?</h2>
            <p className={styles.leftSubtitle}>
              Đừng lo lắng! Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Reset Password</h1>
              <p className={styles.subtitle}>
                Nhập địa chỉ email của bạn để nhận link khôi phục mật khẩu
              </p>
            </div>

            {/* Message */}
            {message.text && (
              <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                {message.type === 'success' ? (
                  <FaCheckCircle className={styles.messageIcon} />
                ) : (
                  <FaExclamationCircle className={styles.messageIcon} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Email Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='name@example.com'
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <>
                    <svg className={styles.spinner} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className={styles.buttonIcon} />
                    Gửi Link Khôi Phục
                  </>
                )}
              </button>

              {/* Back to Login */}
              <Link to='/login' className={styles.backLink}>
                <FaArrowLeft className={styles.backIcon} />
                Quay lại đăng nhập
              </Link>
            </form>

            {/* Info Box */}
            <div className={styles.infoBox}>
              <FaInfoCircle className={styles.infoIcon} />
              <p className={styles.infoText}>
                Nếu không thấy email trong vài phút, vui lòng kiểm tra thư mục spam hoặc thử lại.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
