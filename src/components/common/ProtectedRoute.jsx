import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loading from '../common/Loading'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, hasAnyRole } = useAuth()

  if (loading) return <Loading fullScreen />

  if (!isAuthenticated) return <Navigate to='/login' replace />

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to='/unauthorized' replace />
  }

  return children
}
