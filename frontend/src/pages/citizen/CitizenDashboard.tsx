import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, ClipboardList, CheckCircle, Clock, AlertTriangle,
  MapPin, ArrowRight, TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { issueService } from '@/services/issueService'
import { useAuthStore } from '@/store/authStore'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'

const ISSUE_CATEGORIES = [
  { type: 'POTHOLE', icon: '🕳️', label: 'Pothole' },
  { type: 'GARBAGE', icon: '🗑️', label: 'Garbage' },
  { type: 'BROKEN_STREETLIGHT', icon: '💡', label: 'Streetlight' },
  { type: 'WATER_LEAKAGE', icon: '💧', label: 'Water Leak' },
  { type: 'ROAD_DAMAGE', icon: '🚧', label: 'Road Damage' },
  { type: 'OTHER', icon: '❓', label: 'Other' },
]

export function CitizenDashboard() {
  const { user } = useAuthStore()
  const { data: issues, isLoading } = useQuery({
    queryKey: ['my-issues'],
    queryFn: () => issueService.getMyIssues(),
  })

  const total = issues?.length || 0
  const pending = issues?.filter((i) => !['RESOLVED', 'CLOSED'].includes(i.status)).length || 0
  const resolved = issues?.filter((i) => i.status === 'RESOLVED').length || 0
  const critical = issues?.filter((i) => i.severity === 'CRITICAL').length || 0

  const stats = [
    { label: 'My Reports', value: total, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Critical', value: critical, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'Citizen'} 👋
          </h1>
          <p className="text-gray-500 mt-0.5 flex items-center gap-2">
            Citizen Dashboard
            <DemoDataLabel />
          </p>
        </div>
        <Link to="/citizen/report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Report Issue
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    {isLoading ? (
                      <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                    )}
                  </div>
                  <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Report a Civic Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {ISSUE_CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                to={`/citizen/report?type=${cat.type}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">My Recent Reports</CardTitle>
              <Link to="/citizen/issues" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
              ) : !issues?.length ? (
                <div className="text-center py-10 text-gray-400">
                  <ClipboardList className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No reports yet</p>
                  <Link to="/citizen/report">
                    <Button variant="outline" size="sm" className="mt-3">Report your first issue</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.slice(0, 5).map((issue) => {
                    const tc = getIssueTypeConfig(issue.type)
                    return (
                      <Link key={issue.id} to={`/citizen/issues/${issue.id}`}>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                          <div className="text-xl flex-shrink-0 mt-0.5">{tc.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-gray-400">{issue.issueNumber}</span>
                              <StatusBadge status={issue.status} size="sm" />
                              <SeverityBadge severity={issue.severity} size="sm" />
                            </div>
                            <p className="font-medium text-sm text-gray-900 mt-0.5 truncate">{issue.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {issue.location.ward || 'Unknown ward'}
                              </span>
                              <span>{formatTimeAgo(issue.createdAt)}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reputation */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">
                    {user?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />Reputation</span>
                  <span className="font-bold text-blue-700">{user?.reputationScore || 0} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Reports</span>
                  <span className="font-semibold">{user?.totalReports || total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verified Reports</span>
                  <span className="font-semibold text-green-600">{user?.verifiedReports || resolved}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3">Nearby Issues</h4>
              <Link to="/citizen/map">
                <div className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-700">View City Map</p>
                  <p className="text-xs text-blue-500 mt-0.5">See issues near you</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
