import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { DEMO_USERS } from '@/utils/demoData'
import { formatDate } from '@/utils/helpers'

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  SUPERVISOR: 'bg-purple-100 text-purple-700',
  OFFICER: 'bg-blue-100 text-blue-700',
  CITIZEN: 'bg-green-100 text-green-700',
}

export function UsersPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 flex items-center gap-2">
          {DEMO_USERS.length} users <DemoDataLabel />
        </p>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Name', 'Email', 'Role', 'Reports', 'Joined'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.totalReports || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
