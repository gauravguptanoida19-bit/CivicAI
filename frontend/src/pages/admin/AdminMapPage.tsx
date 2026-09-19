import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Layers, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CivicMap } from '@/components/maps/CivicMap'
import { issueService } from '@/services/issueService'
import { getIssueTypeConfig, formatTimeAgo } from '@/utils/helpers'
import type { CivicIssue, IssueSeverity } from '@/types'

const SEVERITY_FILTERS: { value: IssueSeverity | 'ALL'; label: string; color: string }[] = [
  { value: 'ALL', label: 'All Issues', color: 'bg-gray-500' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'LOW', label: 'Low', color: 'bg-green-500' },
]

export function AdminMapPage() {
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'ALL'>('ALL')
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)

  const { data: issuesPage } = useQuery({
    queryKey: ['issues', { limit: 100 }],
    queryFn: () => issueService.getIssues({ limit: 100 }),
  })

  const allIssues = issuesPage?.data || []
  const filtered = severityFilter === 'ALL' ? allIssues : allIssues.filter((i) => i.severity === severityFilter)

  return (
    <div className="flex flex-col h-screen p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">City Issue Map</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            {filtered.length} issues displayed <DemoDataLabel />
          </p>
        </div>
        <div className="flex items-center gap-2">
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSeverityFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                severityFilter === f.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${f.color}`} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border shadow-sm">
          <CivicMap
            issues={filtered}
            height="100%"
            zoom={12}
            onIssueClick={setSelectedIssue}
            selectedIssueId={selectedIssue?.id}
          />
        </div>

        {/* Right panel */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-hidden hidden xl:flex">
          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4" /> Map Legend
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { color: 'bg-red-500', label: 'Critical' },
                  { color: 'bg-orange-500', label: 'High' },
                  { color: 'bg-yellow-500', label: 'Medium' },
                  { color: 'bg-green-500', label: 'Low' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${item.color} border-2 border-white shadow-sm`} />
                    <span className="text-gray-600">{item.label} Severity</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected issue */}
          {selectedIssue && (
            <Card className="border-blue-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-600 font-bold">{selectedIssue.issueNumber}</span>
                  <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{getIssueTypeConfig(selectedIssue.type).emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{selectedIssue.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedIssue.location.ward}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <SeverityBadge severity={selectedIssue.severity} size="sm" />
                  <StatusBadge status={selectedIssue.status} size="sm" />
                </div>
                <p className="text-xs text-gray-400">{formatTimeAgo(selectedIssue.createdAt)}</p>
                <Link to={`/admin/issues/${selectedIssue.id}`} className="block">
                  <Button size="sm" variant="outline" className="w-full gap-2">
                    Full Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Issue list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wide">
              {filtered.length} Issues
            </h3>
            {filtered.slice(0, 20).map((issue) => (
              <div
                key={issue.id}
                className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                  selectedIssue?.id === issue.id ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <span>{getIssueTypeConfig(issue.type).emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{issue.issueNumber}</p>
                  <p className="text-xs text-gray-400 truncate">{issue.location.ward}</p>
                </div>
                <SeverityBadge severity={issue.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
