import { post } from './api'
import type { CopilotMessage, CopilotSource } from '@/types'
import { DEMO_ISSUES, DEMO_ANALYTICS } from '@/utils/demoData'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Demo RAG responses
function generateDemoResponse(query: string): { content: string; sources: CopilotSource[] } {
  const q = query.toLowerCase()
  const criticalIssues = DEMO_ISSUES.filter((i) => i.severity === 'CRITICAL')
  const unresolvedIssues = DEMO_ISSUES.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED')
  const potholes = DEMO_ISSUES.filter((i) => i.type === 'POTHOLE')
  const waterIssues = DEMO_ISSUES.filter((i) => i.type === 'WATER_LEAKAGE' || i.type === 'DRAINAGE_PROBLEM')

  const sources: CopilotSource[] = []

  if (q.includes('critical') || q.includes('unresolved') || q.includes('high priority')) {
    const relevant = criticalIssues.slice(0, 3)
    relevant.forEach((i) => sources.push({
      issueId: i.id,
      issueNumber: i.issueNumber,
      relevance: 0.95,
      snippet: `${i.title} — ${i.location.ward} — Status: ${i.status}`,
    }))
    return {
      content: `Based on current civic data, there are **${criticalIssues.length} critical-severity issues** currently unresolved across the city.\n\nTop critical issues:\n${relevant.map((i) => `• **${i.issueNumber}**: ${i.title} (${i.location.ward})`).join('\n')}\n\nAll critical issues have been flagged for immediate department attention. I recommend prioritizing open manholes and major road damage given their direct safety impact.\n\n*Note: This response is based on demo data. Sources are referenced below.*`,
      sources,
    }
  }

  if (q.includes('pothole') || q.includes('road')) {
    const relevant = potholes.slice(0, 3)
    relevant.forEach((i) => sources.push({
      issueId: i.id,
      issueNumber: i.issueNumber,
      relevance: 0.92,
      snippet: `${i.title} — Severity: ${i.severity} — ${i.location.ward}`,
    }))
    return {
      content: `There are currently **${potholes.length} pothole/road issues** in the database.\n\n**Breakdown by severity:**\n• Critical: ${potholes.filter((i) => i.severity === 'CRITICAL').length}\n• High: ${potholes.filter((i) => i.severity === 'HIGH').length}\n• Medium: ${potholes.filter((i) => i.severity === 'MEDIUM').length}\n• Low: ${potholes.filter((i) => i.severity === 'LOW').length}\n\n**Most affected wards:** Ward 4, Ward 2 (based on report density).\n\nAll road issues are routed to the Road Maintenance department. Current average resolution time: 48 hours.\n\n*Sources referenced below. Data is demo/simulated.*`,
      sources,
    }
  }

  if (q.includes('water') || q.includes('leakage') || q.includes('drainage')) {
    const relevant = waterIssues.slice(0, 3)
    relevant.forEach((i) => sources.push({
      issueId: i.id,
      issueNumber: i.issueNumber,
      relevance: 0.89,
      snippet: `${i.title} — ${i.location.ward} — Status: ${i.status}`,
    }))
    return {
      content: `**${waterIssues.length} water-related issues** are currently on record this week.\n\n• Water Leakages: ${DEMO_ISSUES.filter((i) => i.type === 'WATER_LEAKAGE').length}\n• Drainage Problems: ${DEMO_ISSUES.filter((i) => i.type === 'DRAINAGE_PROBLEM').length}\n\nWater issues tend to worsen with rainfall. Ward 10 (Pitampura) shows the highest concentration of drainage-related complaints.\n\nThese are routed to the **Water Department** for resolution.\n\n*Sources referenced below. Data is demo/simulated.*`,
      sources,
    }
  }

  if (q.includes('ward') || q.includes('most reports') || q.includes('top')) {
    const wardCounts: Record<string, number> = {}
    DEMO_ISSUES.forEach((i) => {
      if (i.location.ward) wardCounts[i.location.ward] = (wardCounts[i.location.ward] || 0) + 1
    })
    const topWards = Object.entries(wardCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
    return {
      content: `**Top wards by unresolved report volume:**\n\n${topWards.map(([ward, count], i) => `${i + 1}. **${ward}**: ${count} reports`).join('\n')}\n\nWard 4 (Dwarka) consistently has the highest pothole density. This may correlate with road age and traffic volume.\n\n*Data is demo/simulated.*`,
      sources: DEMO_ISSUES.slice(0, 2).map((i) => ({
        issueId: i.id,
        issueNumber: i.issueNumber,
        relevance: 0.78,
        snippet: i.title,
      })),
    }
  }

  if (q.includes('today') || q.includes('summary') || q.includes('incident')) {
    return {
      content: `**Today's Civic Intelligence Summary** *(Demo Data)*\n\n📊 **Activity Overview:**\n• New reports: 14\n• Resolved today: ${DEMO_ANALYTICS.resolvedToday}\n• Critical alerts: ${DEMO_ANALYTICS.criticalIssues}\n• AI detection confidence avg: ${DEMO_ANALYTICS.aiDetectionAccuracy}%\n\n🔴 **Critical Issues Needing Attention:**\n${criticalIssues.slice(0, 3).map((i) => `• ${i.issueNumber}: ${i.title}`).join('\n')}\n\n✅ **Today's Resolutions:**\nRoad Maintenance resolved 6 potholes. Sanitation cleared 4 garbage dumps. Electrical fixed 4 streetlights.\n\n*This summary is generated from demo data. Real implementation queries live database records.*`,
      sources: criticalIssues.slice(0, 2).map((i) => ({
        issueId: i.id,
        issueNumber: i.issueNumber,
        relevance: 0.85,
        snippet: `${i.title} — ${i.status}`,
      })),
    }
  }

  if (q.includes('duplicate')) {
    return {
      content: `**Duplicate Report Analysis** *(Demo Data)*\n\nThe AI duplicate detection system has identified **${Math.floor(DEMO_ISSUES.length * 0.187)} duplicate reports** (${DEMO_ANALYTICS.duplicateDetectionRate}% duplicate rate).\n\nDuplicates are detected by:\n• GPS proximity (within 50m)\n• Same issue type\n• Reported within 24-hour window\n• Image similarity score >0.7\n\nLinked duplicates are consolidated under a master issue to prevent multiple departments from processing the same problem.\n\n*Data is demo/simulated.*`,
      sources: [],
    }
  }

  if (q.includes('oldest') || q.includes('overdue') || q.includes('long')) {
    const oldest = unresolvedIssues
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 3)
    oldest.forEach((i) => sources.push({
      issueId: i.id,
      issueNumber: i.issueNumber,
      relevance: 0.91,
      snippet: `Created: ${new Date(i.createdAt).toLocaleDateString()} — Status: ${i.status}`,
    }))
    return {
      content: `**Oldest Unresolved Issues** *(Demo Data)*\n\nThese issues have remained open the longest:\n\n${oldest.map((i, idx) => `${idx + 1}. **${i.issueNumber}**: ${i.title} — ${i.location.ward}\n   Status: ${i.status} | Severity: ${i.severity}`).join('\n\n')}\n\nI recommend escalating any HIGH/CRITICAL issues that have been open for more than 72 hours.\n\n*Sources referenced below.*`,
      sources,
    }
  }

  // Default response
  return {
    content: `I can help you analyze civic infrastructure data. Here are some things you can ask me:\n\n• *"Show critical unresolved issues"*\n• *"How many potholes are near schools?"*\n• *"Which ward has the most reports?"*\n• *"Summarize today's incidents"*\n• *"Find duplicate reports"*\n• *"Show water issues this week"*\n• *"What are the oldest unresolved issues?"*\n\nI search through **${DEMO_ISSUES.length} civic records** and provide relevant answers with source references.\n\n*Note: Currently running in demo mode with synthetic data.*`,
    sources: [],
  }
}

export const copilotService = {
  async sendMessage(query: string, conversationId?: string): Promise<{
    content: string
    sources: CopilotSource[]
    conversationId: string
  }> {
    if (DEMO_MODE) {
      // Simulate RAG processing time
      await delay(1500 + Math.random() * 1000)
      const response = generateDemoResponse(query)
      return {
        ...response,
        conversationId: conversationId || `conv-${Date.now()}`,
      }
    }

    return post('/ai/query', { query, conversationId })
  },
}
