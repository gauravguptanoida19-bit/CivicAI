import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { DemoBanner } from '@/components/shared/DemoBanner'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      {DEMO_MODE && <DemoBanner />}
      <Outlet />
      <Toaster />
    </div>
  )
}
