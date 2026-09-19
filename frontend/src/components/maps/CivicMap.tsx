import { useEffect, useRef } from 'react'
import type { CivicIssue, HeatmapPoint } from '@/types'
import { ISSUE_TYPE_CONFIG, SEVERITY_CONFIG } from '@/utils/constants'

// Dynamic import of leaflet to avoid SSR issues
declare global {
  interface Window {
    L: typeof import('leaflet')
  }
}

interface CivicMapProps {
  issues: CivicIssue[]
  center?: [number, number]
  zoom?: number
  height?: string
  onIssueClick?: (issue: CivicIssue) => void
  showHeatmap?: boolean
  heatmapData?: HeatmapPoint[]
  selectedIssueId?: string
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#eab308',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
}

function createIssueIcon(issue: CivicIssue) {
  const color = SEVERITY_COLORS[issue.severity] || '#6b7280'
  const tc = ISSUE_TYPE_CONFIG[issue.type]
  return `
    <div style="
      background:${color};
      border:2px solid white;
      border-radius:50%;
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      font-size:14px;
      cursor:pointer;
    ">${tc?.emoji || '📍'}</div>
  `
}

export function CivicMap({
  issues,
  center = [28.6139, 77.209],
  zoom = 12,
  height = '400px',
  onIssueClick,
  selectedIssueId,
}: CivicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<import('leaflet').Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Dynamically import leaflet
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      markersRef.current = []

      issues.forEach((issue) => {
        const { latitude, longitude } = issue.location
        if (!latitude || !longitude) return

        const icon = L.divIcon({
          html: createIssueIcon(issue),
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        })

        const marker = L.marker([latitude, longitude], { icon })

        const color = SEVERITY_COLORS[issue.severity]
        marker.bindPopup(`
          <div style="font-family:system-ui;min-width:200px;">
            <div style="font-weight:700;margin-bottom:6px;color:#1e3a8a;">
              ${ISSUE_TYPE_CONFIG[issue.type]?.emoji} ${issue.issueNumber}
            </div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${issue.title}</div>
            <div style="margin-bottom:4px;">
              <span style="background:${color};color:white;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">${issue.severity}</span>
              <span style="margin-left:6px;font-size:11px;color:#6b7280;">${issue.status.replace(/_/g,' ')}</span>
            </div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px;">
              📍 ${issue.location.ward || 'Unknown ward'}
            </div>
            ${issue.isDemoData ? '<div style="font-size:10px;color:#d97706;margin-top:4px;font-weight:600;">DEMO DATA</div>' : ''}
          </div>
        `, { maxWidth: 250 })

        if (onIssueClick) {
          marker.on('click', () => onIssueClick(issue))
        }

        if (issue.id === selectedIssueId) {
          marker.openPopup()
        }

        marker.addTo(map)
        markersRef.current.push(marker)
      })

      // Fit bounds if we have issues
      if (issues.length > 1) {
        const bounds = L.latLngBounds(
          issues
            .filter((i) => i.location.latitude && i.location.longitude)
            .map((i) => [i.location.latitude, i.location.longitude] as [number, number])
        )
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
        }
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [issues, center, zoom, onIssueClick, selectedIssueId])

  return (
    <div
      ref={mapRef}
      style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
      className="z-0"
    />
  )
}
