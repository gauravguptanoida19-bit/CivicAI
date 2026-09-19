import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { issueService } from '@/services/issueService'
import { toast } from '@/hooks/useToast'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import type { IssueStatus } from '@/types'

export function OfficerIssuesPage() {
  const qc = useQueryClient()
  const { data: issuesPage, isLoading } = useQuery({
    queryKey: ['officer-all-issues'],
    queryFn: () => issueService.getIssues({ limit: 30 }),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IssueStatus }) =>
      issueService.updateIssueStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['officer-all-issues'] })
      toast({ title: 'Status updated', variant: 'success' as never })
    },
  })

  const issues = issuesPage?.data || []

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Queue</h1>
        <p className="text-gray-500 flex items-center gap-2">
          {issues.length} issues <DemoDataLabel />
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {issues.map((issue) => {
            const tc = getIssueTypeConfig(issue.type)
            return (
              <div key={issue.id} className="flex items-center gap-4 p-4 border-b hover:bg-gray-50">
                <span className="text-2xl flex-shrink-0">{tc.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-blue-600 font-bold">{issue.issueNumber}</span>
                    <SeverityBadge severity={issue.severity} size="sm" />
                  </div>
                  <p className="font-medium text-sm truncate">{issue.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{issue.location.ward} · {formatTimeAgo(issue.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Select
                    value={issue.status}
                    onValueChange={(v) => updateStatus.mutate({ id: issue.id, status: v as IssueStatus })}
                  >
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as IssueStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link to={`/officer/issues/${issue.id}`}>
                    <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
