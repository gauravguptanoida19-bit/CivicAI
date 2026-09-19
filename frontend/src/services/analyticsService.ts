import { get } from './api'
import type { AnalyticsSummary, ChartDataPoint, HeatmapPoint } from '@/types'
import { DEMO_ANALYTICS, DEMO_ISSUES, DEMO_WARDS } from '@/utils/demoData'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    if (DEMO_MODE) {
      await delay(300)
      return DEMO_ANALYTICS
    }
    return get<AnalyticsSummary>('/analytics/summary')
  },

  async getIssuesByCategory(): Promise<ChartDataPoint[]> {
    if (DEMO_MODE) {
      await delay(300)
      const counts: Record<string, number> = {}
      DEMO_ISSUES.forEach((issue) => {
        const label = issue.type.replace(/_/g, ' ')
        counts[label] = (counts[label] || 0) + 1
      })
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    }
    return get<ChartDataPoint[]>('/analytics/by-category')
  },

  async getIssuesByWard(): Promise<ChartDataPoint[]> {
    if (DEMO_MODE) {
      await delay(300)
      return DEMO_WARDS.map((w) => ({
        name: w.name.split(' - ')[0],
        value: w.issueCount,
        critical: w.criticalCount,
      }))
    }
    return get<ChartDataPoint[]>('/analytics/by-ward')
  },

  async getSeverityDistribution(): Promise<ChartDataPoint[]> {
    if (DEMO_MODE) {
      await delay(200)
      return [
        { name: 'Critical', value: 23, fill: '#ef4444' },
        { name: 'High', value: 45, fill: '#f97316' },
        { name: 'Medium', value: 38, fill: '#eab308' },
        { name: 'Low', value: 12, fill: '#22c55e' },
      ]
    }
    return get<ChartDataPoint[]>('/analytics/severity')
  },

  async getReportsOverTime(days = 30): Promise<ChartDataPoint[]> {
    if (DEMO_MODE) {
      await delay(400)
      return Array.from({ length: days }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (days - 1 - i))
        return {
          name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.floor(Math.random() * 12) + 2,
          resolved: Math.floor(Math.random() * 8) + 1,
        }
      })
    }
    return get<ChartDataPoint[]>(`/analytics/over-time?days=${days}`)
  },

  async getHeatmapData(): Promise<HeatmapPoint[]> {
    if (DEMO_MODE) {
      await delay(300)
      return DEMO_ISSUES.map((issue) => ({
        lat: issue.location.latitude,
        lng: issue.location.longitude,
        intensity: issue.severityScore / 100,
        issueType: issue.type,
      }))
    }
    return get<HeatmapPoint[]>('/heatmap')
  },

  async getDepartmentWorkload(): Promise<ChartDataPoint[]> {
    if (DEMO_MODE) {
      await delay(300)
      return [
        { name: 'Road Maintenance', active: 34, resolved: 187, total: 221 },
        { name: 'Sanitation', active: 22, resolved: 312, total: 334 },
        { name: 'Water Dept', active: 19, resolved: 143, total: 162 },
        { name: 'Electrical', active: 15, resolved: 98, total: 113 },
        { name: 'Traffic', active: 11, resolved: 89, total: 100 },
        { name: 'Public Works', active: 8, resolved: 76, total: 84 },
        { name: 'Parks', active: 5, resolved: 54, total: 59 },
      ]
    }
    return get<ChartDataPoint[]>('/analytics/departments')
  },

  async getTrendForecast(): Promise<{ category: string; trend: string; change: number; confidence: number }[]> {
    if (DEMO_MODE) {
      await delay(600)
      return [
        { category: 'Road Issues', trend: 'increasing', change: 12, confidence: 0.74 },
        { category: 'Waste Reports', trend: 'stable', change: 2, confidence: 0.81 },
        { category: 'Water Issues', trend: 'increasing', change: 18, confidence: 0.68 },
        { category: 'Lighting', trend: 'decreasing', change: -8, confidence: 0.72 },
        { category: 'Safety Hazards', trend: 'stable', change: 5, confidence: 0.65 },
      ]
    }
    return get('/analytics/forecast')
  },
}
