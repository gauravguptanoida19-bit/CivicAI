import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapPin, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CivicMap } from '@/components/maps/CivicMap'
import { issueService } from '@/services/issueService'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import type { CivicIssue } from '@/types'

export function CitizenMapPage() {
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)

  const { data: issues = [] } = useQuery({
    queryKey: ['nearby-issues'],
    queryFn: () => issueService.getNearbyIssues(28.6139, 77.209, 10),
  })

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] lg:h-screen p-6 gap-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Nearby Issues
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-2">
            {issues.length} issues in your area <DemoDataLabel />
          </p>
        </div>
        <Link to="/citizen/report">
          <Button size="sm" className="gap-2">
            <MapPin className="h-3.5 w-3.5" /> Report Issue
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border">
          <CivicMap
            issues={issues}
            height="100%"
            onIssueClick={setSelectedIssue}
            selectedIssueId={selectedIssue?.id}
          />
        </div>

        {/* Side panel */}
        <div className="w-80 flex-shrink-0 overflow-y-auto space-y-3 hidden lg:block">
          {selectedIssue ? (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-400">{selectedIssue.issueNumber}</span>
                  <button
                    className="text-xs text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedIssue(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getIssueTypeConfig(selectedIssue.type).emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{selectedIssue.title}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(selectedIssue.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status={selectedIssue.status} size="sm" />
                  <SeverityBadge severity={selectedIssue.severity} size="sm" />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {selectedIssue.location.ward}
                </p>
                <Link to={`/citizen/issues/${selectedIssue.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-400 text-sm py-4">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Click a map marker to see issue details
            </div>
          )}

          <h3 className="font-semibold text-sm text-gray-700">Recent Issues</h3>
          {issues.slice(0, 8).map((issue) => {
            const tc = getIssueTypeConfig(issue.type)
            return (
              <div
                key={issue.id}
                className="flex items-start gap-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedIssue(issue)}
              >
                <span className="text-lg flex-shrink-0">{tc.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{issue.title}</p>
                  <div className="flex gap-1 mt-1">
                    <SeverityBadge severity={issue.severity} size="sm" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
