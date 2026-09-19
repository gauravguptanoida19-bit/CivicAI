import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, AlertTriangle, CheckCircle, Clock, TrendingUp,
  ArrowRight, Activity, Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { CivicMap } from '@/components/maps/CivicMap'
import { analyticsService } from '@/services/analyticsService'
import { issueService } from '@/services/issueService'
import { useNotificationStore } from '@/store/notificationStore'
import { formatTimeAgo, getIssueTypeConfig } from '@/utils/helpers'
import type { CivicIssue } from '@/types'
import { DEMO_ISSUES } from '@/utils/demoData'

interface LiveFeedItem {
  id: string
  time: string
  emoji: string
  type: string
  ward: string
  severity: string
  isNew?: boolean
}

export function AdminDashboard() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => analyticsService.getSummary(),
  })
  const { data: issues = [] } = useQuery({
    queryKey: ['issues', { limit: 50 }],
    queryFn: () => issueService.getIssues({ limit: 50 }).then((r) => r.data),
  })
  const { notifications } = useNotificationStore()

  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([])
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null)

  // Build initial live feed from recent issues
  useEffect(() => {
    const initial = DEMO_ISSUES.slice(0, 8).map((iss) => {
      const tc = getIssueTypeConfig(iss.type)
      return {
        id: iss.id,
        time: formatTimeAgo(iss.createdAt),
        emoji: tc.emoji,
        type: tc.label,
        ward: iss.location.ward || 'Unknown',
        severity: iss.severity,
      }
    })
    setLiveFeed(initial)
  }, [])

  // Add new feed items from socket notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0]
      if (!latest.isRead) {
        const newItem: LiveFeedItem = {
          id: latest.id,
          time: 'just now',
          emoji: '🚨',
          type: latest.title.replace('New Issue Reported', '').trim() || 'New Issue',
          ward: 'Live',
          severity: latest.type === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          isNew: true,
        }
        setLiveFeed((prev) => [newItem, ...prev].slice(0, 12))
      }
    }
  }, [notifications])

  const metrics = [
    {
      label: 'Total Reports',
      value: summary?.totalReports || 1247,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: '+14 today',
    },
    {
      label: 'Open Issues',
      value: summary?.openIssues || 118,
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: 'Needs attention',
    },
    {
      label: 'Critical Issues',
      value: summary?.criticalIssues || 23,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      sub: 'Immediate action',
    },
    {
      label: 'Resolved Today',
      value: summary?.resolvedToday || 14,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      sub: 'Great progress',
    },
    {
      label: 'Avg Resolution',
      value: `${summary?.averageResolutionHours?.toFixed(0) || 38}h`,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: 'With AI triage',
    },
    {
      label: 'AI Accuracy',
      value: `${summary?.aiDetectionAccuracy?.toFixed(0) || 91}%`,
      icon: Zap,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      sub: 'Detection confidence',
    },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Municipal Command Center</h1>
          <p className="text-gray-500 mt-0.5 flex items-center gap-2">
            Real-time city infrastructure intelligence
            <DemoDataLabel />
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/ai-copilot">
            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="h-4 w-4" /> AI Copilot
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" /> Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`inline-flex rounded-lg p-2 ${m.bg} mb-3`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
                {loadingSummary ? (
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                )}
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map — 2/3 */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">City Issue Map</CardTitle>
              <Link to="/admin/map">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Full Map <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <CivicMap
                issues={issues.slice(0, 30)}
                height="380px"
                onIssueClick={setSelectedIssue}
                selectedIssueId={selectedIssue?.id}
              />
            </CardContent>
          </Card>

          {/* Selected issue quick view */}
          {selectedIssue && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="mt-3 border-blue-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-2xl">{getIssueTypeConfig(selectedIssue.type).emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{selectedIssue.issueNumber}</span>
                      <SeverityBadge severity={selectedIssue.severity} size="sm" />
                      <StatusBadge status={selectedIssue.status} size="sm" />
                    </div>
                    <p className="font-semibold text-sm mt-0.5">{selectedIssue.title}</p>
                  </div>
                  <Link to={`/admin/issues/${selectedIssue.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                  <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Live feed — 1/3 */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Issue Feed
              </CardTitle>
              <Link to="/admin/issues">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  All Issues <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3">
              <AnimatePresence>
                {liveFeed.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg mb-2 text-sm border transition-colors ${
                      item.isNew ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.type}</p>
                      <p className="text-xs text-gray-500">{item.ward}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        item.severity === 'CRITICAL' ? 'bg-red-100 text-red-700'
                        : item.severity === 'HIGH' ? 'bg-orange-100 text-orange-700'
                        : item.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                        {item.severity}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Manage Issues', href: '/admin/issues', icon: FileText, color: 'bg-blue-600' },
          { label: 'City Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-purple-600' },
          { label: 'AI Copilot', href: '/admin/ai-copilot', icon: Zap, color: 'bg-cyan-600' },
          { label: 'Departments', href: '/admin/departments', icon: CheckCircle, color: 'bg-green-600' },
        ].map((action) => (
          <Link key={action.href} to={action.href}>
            <div className="flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <div className={`${action.color} rounded-lg p-2.5`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-sm text-gray-800">{action.label}</span>
              <ArrowRight className="h-4 w-4 text-gray-300 ml-auto" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
