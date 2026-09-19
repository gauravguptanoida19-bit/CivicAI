import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useAuthStore } from '@/store/authStore'

// Public pages
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

// Citizen pages
import { CitizenDashboard } from '@/pages/citizen/CitizenDashboard'
import { ReportIssuePage } from '@/pages/citizen/ReportIssuePage'
import { CitizenIssuesPage } from '@/pages/citizen/CitizenIssuesPage'
import { CitizenIssueDetailPage } from '@/pages/citizen/CitizenIssueDetailPage'
import { CitizenMapPage } from '@/pages/citizen/CitizenMapPage'

// Admin pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminIssuesPage } from '@/pages/admin/AdminIssuesPage'
import { AdminIssueDetailPage } from '@/pages/admin/AdminIssueDetailPage'
import { AdminMapPage } from '@/pages/admin/AdminMapPage'
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage'
import { AICopilotPage } from '@/pages/admin/AICopilotPage'
import { DepartmentsPage } from '@/pages/admin/DepartmentsPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'

// Officer pages
import { OfficerDashboard } from '@/pages/officer/OfficerDashboard'
import { OfficerIssuesPage } from '@/pages/officer/OfficerIssuesPage'

// Shared
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ProfilePage } from '@/pages/ProfilePage'

function RoleRedirect() {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role === 'ADMIN' || user?.role === 'SUPERVISOR') return <Navigate to="/admin/dashboard" replace />
  if (user?.role === 'OFFICER') return <Navigate to="/officer/dashboard" replace />
  return <Navigate to="/citizen/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Auto-redirect after login */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Protected dashboard routes */}
        <Route element={<DashboardLayout />}>
          {/* Citizen */}
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/citizen/report" element={<ReportIssuePage />} />
          <Route path="/citizen/issues" element={<CitizenIssuesPage />} />
          <Route path="/citizen/issues/:id" element={<CitizenIssueDetailPage />} />
          <Route path="/citizen/map" element={<CitizenMapPage />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/issues" element={<AdminIssuesPage />} />
          <Route path="/admin/issues/:id" element={<AdminIssueDetailPage />} />
          <Route path="/admin/map" element={<AdminMapPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/ai-copilot" element={<AICopilotPage />} />
          <Route path="/admin/departments" element={<DepartmentsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />

          {/* Officer */}
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/issues" element={<OfficerIssuesPage />} />
          <Route path="/officer/issues/:id" element={<AdminIssueDetailPage />} />

          {/* Shared */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
