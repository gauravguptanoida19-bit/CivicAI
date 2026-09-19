import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CheckSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { issueService } from '@/services/issueService'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'

export function OfficerDashboard() {
  const { user } = useAuthStore()
  const { data: issues = [] } = useQuery({
    queryKey: ['officer-issues'],
    queryFn: () => issueService.getIssues({ status: 'ASSIGNED', limit: 20 }).then((r) => r.data),
  })

  const stats = [
    { label: 'Assigned', value: issues.filter((i) => i.status === 'ASSIGNED').length, icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: issues.filter((i) => i.status === 'IN_PROGRESS').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved Today', value: 3, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="text-gray-500 flex items-center gap-2">
          Welcome back, {user?.name?.split(' ')[0]} <DemoDataLabel />
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <div className={`rounded-lg p-2.5 ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base">Assigned Issues</CardTitle>
          <Link to="/officer/issues">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          {issues.slice(0, 6).map((issue) => {
            const tc = getIssueTypeConfig(issue.type)
            return (
              <Link key={issue.id} to={`/officer/issues/${issue.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border-b last:border-0">
                  <span className="text-xl">{tc.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{issue.issueNumber}</span>
                      <SeverityBadge severity={issue.severity} size="sm" />
                      <StatusBadge status={issue.status} size="sm" />
                    </div>
                    <p className="font-medium text-sm truncate">{issue.title}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(issue.createdAt)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
