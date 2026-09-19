import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 flex items-center gap-2">System configuration <DemoDataLabel /></p>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        In demo mode, settings changes are not persisted. Configure via environment variables in production.
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">AI Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>Gemini (recommended)</option>
              <option>OpenAI GPT-4</option>
              <option>Demo Mode (no API key needed)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Detection Confidence Threshold</Label>
            <Input type="number" defaultValue="0.40" min="0.1" max="1.0" step="0.05" />
            <p className="text-xs text-gray-400">Issues below this threshold will be flagged for manual review</p>
          </div>
          <div className="space-y-2">
            <Label>Duplicate Detection Radius (meters)</Label>
            <Input type="number" defaultValue="50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Severity Weights</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">Adjust how much each factor contributes to the AI severity score.</p>
          {[
            { label: 'Issue Type Weight', value: 30 },
            { label: 'Location Risk Weight', value: 25 },
            { label: 'Duration Weight', value: 20 },
            { label: 'Proximity to Infrastructure', value: 15 },
            { label: 'Duplicate Report Boost', value: 10 },
          ].map((w) => (
            <div key={w.label} className="flex items-center gap-4">
              <Label className="w-52 flex-shrink-0">{w.label}</Label>
              <Input type="number" defaultValue={w.value} className="w-24" />
              <span className="text-sm text-gray-400">pts max</span>
            </div>
          ))}
          <Button variant="outline" size="sm">Save Weights (Demo only)</Button>
        </CardContent>
      </Card>
    </div>
  )
}
