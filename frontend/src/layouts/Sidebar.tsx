import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, MapPin, BarChart3, Bot, Building2,
  Users, Settings, Bell, User, ClipboardList, AlertTriangle,
  CheckSquare, LogOut, ChevronLeft, ChevronRight, Map,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { authService } from '@/services/authService'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles: UserRole[]
}

const navItems: NavItem[] = [
  // Citizen
  { label: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard, roles: ['CITIZEN'] },
  { label: 'Report Issue', href: '/citizen/report', icon: AlertTriangle, roles: ['CITIZEN'] },
  { label: 'My Reports', href: '/citizen/issues', icon: ClipboardList, roles: ['CITIZEN'] },
  { label: 'Nearby Issues', href: '/citizen/map', icon: MapPin, roles: ['CITIZEN'] },
  // Admin
  { label: 'Command Center', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Issues', href: '/admin/issues', icon: FileText, roles: ['ADMIN', 'SUPERVISOR', 'OFFICER'] },
  { label: 'City Map', href: '/admin/map', icon: Map, roles: ['ADMIN', 'SUPERVISOR', 'OFFICER'] },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'AI Copilot', href: '/admin/ai-copilot', icon: Bot, roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'Departments', href: '/admin/departments', icon: Building2, roles: ['ADMIN'] },
  { label: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { label: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
  // Officer
  { label: 'Dashboard', href: '/officer/dashboard', icon: LayoutDashboard, roles: ['OFFICER'] },
  { label: 'Assigned Issues', href: '/officer/issues', icon: CheckSquare, roles: ['OFFICER'] },
  // Shared
  { label: 'Notifications', href: '/notifications', icon: Bell, roles: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPERVISOR'] },
  { label: 'Profile', href: '/profile', icon: User, roles: ['CITIZEN', 'OFFICER', 'ADMIN', 'SUPERVISOR'] },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const location = useLocation()
  const navigate = useNavigate()

  const role = user?.role || 'CITIZEN'
  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  // Group by role section
  const sections = role === 'CITIZEN'
    ? [{ title: 'Citizen', items: visibleItems.filter((i) => i.roles.includes('CITIZEN')) }]
    : role === 'ADMIN'
    ? [
        { title: 'Operations', items: visibleItems.filter((i) => ['ADMIN', 'SUPERVISOR'].some(r => i.roles.includes(r as UserRole))) },
        { title: 'Account', items: visibleItems.filter((i) => i.href === '/notifications' || i.href === '/profile') },
      ]
    : [{ title: 'Officer', items: visibleItems }]

  const handleLogout = async () => {
    await authService.logout()
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">CA</span>
            </div>
            <span className="font-bold text-primary">CivicAI</span>
          </div>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">CA</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn('text-muted-foreground hover:text-foreground', collapsed && 'absolute left-full ml-2 hidden')}
        >
          {collapsed ? null : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              const badge = item.href === '/notifications' ? unreadCount : item.badge
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && badge && badge > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  {collapsed && badge && badge > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>

      {/* Collapse toggle (bottom) */}
      <button
        onClick={onToggle}
        className="border-t p-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
