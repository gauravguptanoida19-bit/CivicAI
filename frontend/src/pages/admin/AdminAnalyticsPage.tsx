import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { analyticsService } from '@/services/analyticsService'

type TimeRange = '7' | '30' | '90'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#eab308', '#ef4444']

export function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30')

  const { data: summary } = useQuery({ queryKey: ['analytics-summary'], queryFn: analyticsService.getSummary })
  const { data: byCategory, isLoading: loadCat } = useQuery({ queryKey: ['by-category'], queryFn: analyticsService.getIssuesByCategory })
  const { data: byWard, isLoading: loadWard } = useQuery({ queryKey: ['by-ward'], queryFn: analyticsService.getIssuesByWard })
  const { data: severity } = useQuery({ queryKey: ['severity-dist'], queryFn: analyticsService.getSeverityDistribution })
  const { data: overTime, isLoading: loadTime } = useQuery({
    queryKey: ['over-time', timeRange],
    queryFn: () => analyticsService.getReportsOverTime(Number(timeRange)),
  })
  const { data: deptWorkload } = useQuery({ queryKey: ['dept-workload'], queryFn: analyticsService.getDepartmentWorkload })
  const { data: forecast, isLoading: loadForecast } = useQuery({
    queryKey: ['forecast'],
    queryFn: analyticsService.getTrendForecast,
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 flex items-center gap-2">
            City infrastructure intelligence <DemoDataLabel />
          </p>
        </div>
        <div className="flex gap-2">
          {(['7', '30', '90'] as TimeRange[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={timeRange === r ? 'default' : 'outline'}
              onClick={() => setTimeRange(r)}
            >
              {r}d
            </Button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI Detection Accuracy', value: `${summary?.aiDetectionAccuracy?.toFixed(1) || 91.3}%`, trend: '+1.2%', good: true },
          { label: 'Avg Resolution', value: `${summary?.averageResolutionHours?.toFixed(0) || 38}h`, trend: '-4h', good: true },
          { label: 'Duplicate Rate', value: `${summary?.duplicateDetectionRate?.toFixed(1) || 18.7}%`, trend: '+2.1%', good: false },
          { label: 'Critical Open', value: summary?.criticalIssues || 23, trend: '-3', good: true },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${kpi.good ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.good ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {kpi.trend} vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports over time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reports Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {loadTime ? <div className="h-64 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" /></div> : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={overTime || []}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" name="New Reports" stroke="#3b82f6" fill="url(#colorReports)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Issues by category */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loadCat ? <CardSkeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byCategory || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
                  <Tooltip />
                  <Bar dataKey="value" name="Issues" radius={[0, 4, 4, 0]}>
                    {(byCategory || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Severity distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severity || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {(severity || []).map((entry, i) => (
                    <Cell key={i} fill={entry.fill as string || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by ward */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Issues by Ward</CardTitle>
          </CardHeader>
          <CardContent>
            {loadWard ? <CardSkeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byWard || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="critical" name="Critical" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Department workload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Department Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptWorkload || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" name="Active" fill="#f97316" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#22c55e" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Trend Forecast */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Trend Forecast
            <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-normal">
              AI Model Estimates
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            Forecasts are model estimates based on historical patterns. Uncertainty increases over longer horizons. Not guaranteed predictions.
          </div>
          {loadForecast ? <CardSkeleton /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(forecast || []).map((item) => (
                <div key={item.category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-900">{item.category}</p>
                    {item.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : item.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className={`text-sm font-bold ${
                    item.trend === 'increasing' ? 'text-red-600'
                    : item.trend === 'decreasing' ? 'text-green-600'
                    : 'text-gray-600'
                  }`}>
                    {item.trend === 'increasing' ? `↑ +${item.change}%`
                    : item.trend === 'decreasing' ? `↓ ${item.change}%`
                    : `→ ~Stable (+${item.change}%)`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Model confidence: {(item.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
