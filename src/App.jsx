import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ROLES } from './utils/constants'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoginForm from './pages/auth/LoginForm'
import ForgotPasswordForm from './pages/auth/ForgotPasswordForm'
import ResetPasswordFlow from './pages/auth/ResetPasswordFlow'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import Analytics from './pages/admin/Analytics'
import ProductManagement from './pages/admin/ProductManagement'
import WarrantyApproval from './pages/admin/WarrantyApproval'
import EVMDashboard from './pages/evm-staff/EVMDashboard'
import CampaignManagement from './pages/evm-staff/CampaignManagement'
import SCStaffDashboard from './pages/sc-staff/SCStaffDashboard'
import TechnicianDashboard from './pages/technician/TechnicianDashboard'
import MyClaims from './pages/technician/MyClaims'
import CreateClaim from './pages/technician/CreateClaim'
import MainLayout from './components/layout/MainLayout'
import './index.css'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/forgot-password' element={<ForgotPasswordForm />} />
          <Route path='/reset-password' element={<ResetPasswordFlow />} />

          <Route path='/admin/*' element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <MainLayout>
                <Routes>
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='users' element={<UserManagement />} />
                  <Route path='products' element={<ProductManagement />} />
                  <Route path='warranty-approval' element={<WarrantyApproval />} />
                  <Route path='analytics' element={<Analytics />} />
                  <Route path='*' element={<Navigate to='/admin/dashboard' replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path='/evm/*' element={
            <ProtectedRoute allowedRoles={[ROLES.EVM_STAFF]}>
              <MainLayout>
                <Routes>
                  <Route path='dashboard' element={<EVMDashboard />} />
                  <Route path='products' element={<ProductManagement />} />
                  <Route path='campaigns' element={<CampaignManagement />} />
                  <Route path='warranty-approval' element={<WarrantyApproval />} />
                  <Route path='*' element={<Navigate to='/evm/dashboard' replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path='/sc-staff/*' element={
            <ProtectedRoute allowedRoles={[ROLES.SC_STAFF]}>
              <MainLayout>
                <Routes>
                  <Route
                    path='dashboard'
                    element={<SCStaffDashboard />}
                  />
                  <Route
                    path='*'
                    element={<Navigate to='/sc-staff/dashboard' replace />}
                  />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path='/technician/*' element={
            <ProtectedRoute allowedRoles={[ROLES.SC_TECHNICIAN]}>
              <MainLayout>
                <Routes>
                  <Route path='dashboard' element={<TechnicianDashboard />} />
                  <Route path='claims' element={<MyClaims />} />
                  <Route path='claims/new' element={<CreateClaim />} />
                  <Route path='*' element={<Navigate to='/technician/dashboard' replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
