import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, ArrowRight, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { TableSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { issueService } from '@/services/issueService'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import { WARDS } from '@/utils/constants'
import type { IssueFilters, IssueSeverity, IssueStatus, IssueType, PaginatedResponse, CivicIssue } from '@/types'

export function AdminIssuesPage() {
  const [filters, setFilters] = useState<IssueFilters>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery<PaginatedResponse<CivicIssue>>({
    queryKey: ['issues', filters, search],
    queryFn: () => issueService.getIssues({ ...filters, search: search || undefined }),
  })

  const updateFilter = (key: keyof IssueFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value === 'ALL' ? undefined : value, page: 1 }))
  }

  const issues = data?.data || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 1
  const page = filters.page || 1

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue Management</h1>
          <p className="text-gray-500 flex items-center gap-2">
            {total} total issues <DemoDataLabel />
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search by ID, address, type..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setFilters((p) => ({ ...p, page: 1 })) }}
              />
            </div>
            <Select value={filters.severity || 'ALL'} onValueChange={(v) => updateFilter('severity', v as IssueSeverity)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Severities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status || 'ALL'} onValueChange={(v) => updateFilter('status', v as IssueStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="REPORTED">Reported</SelectItem>
                <SelectItem value="AI_ANALYZED">AI Analyzed</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.type || 'ALL'} onValueChange={(v) => updateFilter('type', v as IssueType)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Issue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="POTHOLE">🕳️ Pothole</SelectItem>
                <SelectItem value="GARBAGE">🗑️ Garbage</SelectItem>
                <SelectItem value="BROKEN_STREETLIGHT">💡 Streetlight</SelectItem>
                <SelectItem value="WATER_LEAKAGE">💧 Water Leakage</SelectItem>
                <SelectItem value="ROAD_DAMAGE">🚧 Road Damage</SelectItem>
                <SelectItem value="OPEN_MANHOLE">⚠️ Open Manhole</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.ward || 'ALL'} onValueChange={(v) => updateFilter('ward', v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Wards</SelectItem>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
            {(filters.severity || filters.status || filters.type || filters.ward || search) && (
              <Button variant="ghost" size="sm" onClick={() => { setFilters({ page: 1, limit: 20 }); setSearch('') }}>
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">{total} Issues Found</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4"><TableSkeleton rows={8} /></div>
          ) : !issues.length ? (
            <EmptyState
              title="No issues found"
              description="Try adjusting your search filters."
              className="py-16"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {['Issue ID', 'Type', 'Location', 'Severity', 'Status', 'Department', 'Reported', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => {
                    const tc = getIssueTypeConfig(issue.type)
                    return (
                      <tr key={issue.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-blue-600 font-semibold">{issue.issueNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>{tc.emoji}</span>
                            <span className="text-gray-700 font-medium whitespace-nowrap">{tc.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-[150px]">
                            <p className="truncate text-gray-700">{issue.location.ward || '—'}</p>
                            <p className="text-xs text-gray-400 truncate">{issue.location.address}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge severity={issue.severity} size="sm" />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={issue.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {issue.department?.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatTimeAgo(issue.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/admin/issues/${issue.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              View <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page! - 1 }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page! + 1 }))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
