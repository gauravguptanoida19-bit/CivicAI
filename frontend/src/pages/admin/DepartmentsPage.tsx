import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { DEMO_DEPARTMENTS } from '@/utils/demoData'
import { Building2, Users, CheckCircle, Clock } from 'lucide-react'

export function DepartmentsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-500 flex items-center gap-2">
          {DEMO_DEPARTMENTS.length} departments <DemoDataLabel />
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_DEPARTMENTS.map((dept) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{dept.name}</CardTitle>
                  <p className="text-xs text-gray-400 font-mono">{dept.code}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-500">{dept.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Users className="h-3.5 w-3.5" />
                  {dept.officerCount} officers
                </div>
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  {dept.activeIssues} active
                </div>
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {dept.resolvedIssues} resolved
                </div>
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Clock className="h-3.5 w-3.5" />
                  ~{dept.averageResolutionHours}h avg
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {dept.issueTypes.map((t) => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {t.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
