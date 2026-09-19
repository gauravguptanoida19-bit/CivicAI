import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ClipboardList, MapPin, ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { issueService } from '@/services/issueService'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'

export function CitizenIssuesPage() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ['my-issues'],
    queryFn: () => issueService.getMyIssues(),
  })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 mt-0.5 flex items-center gap-2">
            Track all your submitted issues <DemoDataLabel />
          </p>
        </div>
        <Link to="/citizen/report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {issues?.length || 0} Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : !issues?.length ? (
            <EmptyState
              icon={ClipboardList}
              title="No reports yet"
              description="Report your first civic issue and track its progress here."
              action={<Link to="/citizen/report"><Button>Report an Issue</Button></Link>}
            />
          ) : (
            <div className="space-y-2">
              {issues.map((issue) => {
                const tc = getIssueTypeConfig(issue.type)
                return (
                  <Link key={issue.id} to={`/citizen/issues/${issue.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <span className="text-2xl flex-shrink-0">{tc.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs text-gray-400">{issue.issueNumber}</span>
                          <StatusBadge status={issue.status} size="sm" />
                          <SeverityBadge severity={issue.severity} size="sm" />
                        </div>
                        <p className="font-medium text-sm truncate">{issue.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {issue.location.ward}
                          </span>
                          <span>{formatTimeAgo(issue.createdAt)}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
