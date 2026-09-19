import { Info } from 'lucide-react'

export function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-amber-800 text-xs">
        <Info className="h-3.5 w-3.5 flex-shrink-0" />
        <span>
          <strong>DEMO MODE</strong> — All data shown is synthetic and does not represent real city incidents, real people, or real infrastructure.
        </span>
      </div>
    </div>
  )
}

export function DemoDataLabel() {
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-700 border border-amber-300">
      Demo Data
    </span>
  )
}
