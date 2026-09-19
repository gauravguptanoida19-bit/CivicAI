import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, MapPin, Clock, Building2, User, CheckCircle,
  AlertTriangle, Brain, GitMerge, Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { issueService } from '@/services/issueService'
import { toast } from '@/hooks/useToast'
import { formatDateTime, formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import { DEMO_DEPARTMENTS } from '@/utils/demoData'
import type { IssueStatus } from '@/types'

const STATUS_OPTIONS: IssueStatus[] = ['REPORTED', 'AI_ANALYZED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

export function AdminIssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [notes, setNotes] = useState('')

  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: () => issueService.getIssue(id!),
    enabled: !!id,
  })

  const updateStatus = useMutation({
    mutationFn: ({ status }: { status: IssueStatus }) =>
      issueService.updateIssueStatus(id!, status, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issue', id] })
      toast({ title: 'Status updated', variant: 'success' as never })
    },
  })

  const assignDept = useMutation({
    mutationFn: (deptId: string) => issueService.assignIssue(id!, deptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issue', id] })
      toast({ title: 'Department assigned', variant: 'success' as never })
    },
  })

  if (isLoading) return <div className="p-6 space-y-4 max-w-5xl mx-auto"><CardSkeleton /><CardSkeleton /></div>
  if (!issue) return <div className="p-6">Issue not found</div>

  const tc = getIssueTypeConfig(issue.type)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/admin/issues">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Issues</Button>
        </Link>
        <span className="font-mono text-sm text-gray-400">{issue.issueNumber}</span>
        <DemoDataLabel />
        <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{tc.emoji}</span>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} showScore score={issue.severityScore} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" /> {issue.location.address || issue.location.ward}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" /> {formatDateTime(issue.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="h-4 w-4" /> {issue.reportedBy.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Building2 className="h-4 w-4" /> {issue.department?.name || 'Unassigned'}
                    </div>
                  </div>
                  {issue.duplicateCount > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-3 py-2">
                      <GitMerge className="h-3.5 w-3.5" />
                      {issue.duplicateCount} duplicate report(s) merged into this issue
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {issue.aiAnalysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Analysis
                  <DemoDataLabel />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-900">
                      {(issue.aiAnalysis.confidence * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-blue-600">Confidence</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-gray-900">{issue.severityScore}/100</p>
                    <p className="text-xs text-gray-500">Priority Score</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <SeverityBadge severity={issue.severity} />
                    <p className="text-xs text-gray-500 mt-1">Severity</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-1">AI Description</p>
                  <p className="text-sm text-gray-600">{issue.aiAnalysis.description}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Possible Impact</p>
                  <p className="text-sm text-amber-700">{issue.aiAnalysis.potentialImpact}</p>
                  <p className="text-xs text-amber-500 italic mt-1">AI assessment — advisory only, not a factual determination</p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Severity Score Breakdown</p>
                  {issue.aiAnalysis.severityFactors.map((f) => (
                    <div key={f.factor} className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{f.factor}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (f.score / 30) * 100)}%` }} />
                      </div>
                      <span className="text-xs font-mono text-gray-600 w-8 text-right">+{f.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {issue.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.type === 'RESOLVED' ? 'bg-green-100 text-green-600'
                      : event.type === 'AI_ANALYZED' ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                    }`}>
                      <CheckCircle className="h-3.5 w-3.5" />
                    </div>
                    {i < issue.timeline.length - 1 && <div className="flex-1 w-0.5 bg-gray-100 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <p className="font-semibold text-sm text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    {event.performedBy && (
                      <p className="text-xs text-gray-400 mt-0.5">by {event.performedBy.name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar — actions */}
        <div className="space-y-4">
          {/* Status update */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={issue.status}
                onValueChange={(v) => updateStatus.mutate({ status: v as IssueStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <textarea
                className="w-full rounded-md border border-input px-3 py-2 text-sm min-h-[70px] resize-none"
                placeholder="Officer notes (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              {updateStatus.isPending && (
                <p className="text-xs text-blue-600">Updating...</p>
              )}
            </CardContent>
          </Card>

          {/* Department assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Assign Department</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={issue.department?.id || ''}
                onValueChange={(v) => assignDept.mutate(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_DEPARTMENTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {issue.aiAnalysis?.recommendedDepartment && (
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI suggests: {issue.aiAnalysis.recommendedDepartment}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Issue metadata */}
          <Card>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Issue ID</span>
                <span className="font-mono font-semibold">{issue.issueNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reports</span>
                <span className="font-semibold">{issue.reportCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duplicates</span>
                <span className="font-semibold">{issue.duplicateCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ward</span>
                <span className="font-semibold">{issue.location.ward || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-600">{formatTimeAgo(issue.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
