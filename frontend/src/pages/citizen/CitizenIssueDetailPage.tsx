import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Building2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { issueService } from '@/services/issueService'
import { formatDateTime, getIssueTypeConfig } from '@/utils/helpers'
import { STATUS_CONFIG } from '@/utils/constants'
import type { IssueStatus } from '@/types'

const TIMELINE_STEPS: IssueStatus[] = ['REPORTED', 'AI_ANALYZED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

export function CitizenIssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: () => issueService.getIssue(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="p-6 space-y-4"><CardSkeleton /><CardSkeleton /></div>
  if (!issue) return <div className="p-6 text-gray-500">Issue not found</div>

  const tc = getIssueTypeConfig(issue.type)
  const currentStepIdx = TIMELINE_STEPS.indexOf(issue.status as IssueStatus)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/citizen/issues">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        </Link>
        <span className="font-mono text-sm text-gray-400">{issue.issueNumber}</span>
        <DemoDataLabel />
      </div>

      {/* Hero card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{tc.emoji}</span>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <StatusBadge status={issue.status} />
                <SeverityBadge severity={issue.severity} showScore score={issue.severityScore} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {issue.location.address || issue.location.ward}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  {formatDateTime(issue.createdAt)}
                </div>
                {issue.department && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building2 className="h-4 w-4" />
                    {issue.department.name}
                  </div>
                )}
                {issue.assignedTo && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <CheckCircle className="h-4 w-4" />
                    {issue.assignedTo.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          {issue.imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
              <div className="text-gray-300 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
                <p className="text-sm">Image evidence</p>
                <p className="text-xs">(Demo: image display)</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Issue Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {TIMELINE_STEPS.map((stepStatus, i) => {
              const isCompleted = i <= currentStepIdx
              const isCurrent = i === currentStepIdx
              const sc = STATUS_CONFIG[stepStatus]
              return (
                <div key={stepStatus} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-300'
                    } ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-1' : ''}`}>
                      {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-blue-300' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className={`pb-4 ${isCurrent ? 'font-semibold text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    <p className="text-sm">{sc.label}</p>
                    <p className="text-xs mt-0.5 font-normal">{sc.description}</p>
                    {isCurrent && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Current Stage
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI analysis */}
      {issue.aiAnalysis && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              AI Analysis
              <DemoDataLabel />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-gray-600">{issue.aiAnalysis.description}</p>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="font-medium text-amber-800 mb-1">Possible Impact</p>
              <p className="text-amber-700">{issue.aiAnalysis.potentialImpact}</p>
              <p className="text-xs text-amber-500 italic mt-1">AI-generated assessment. Advisory only.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline events */}
      {issue.timeline.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issue.timeline.map((event) => (
                <div key={event.id} className="flex gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{event.event}</p>
                    <p className="text-gray-500">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
