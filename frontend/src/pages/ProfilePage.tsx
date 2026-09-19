import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/helpers'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { User, Mail, Shield, Calendar, Star, FileCheck } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuthStore()
  if (!user) return null

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 flex items-center gap-2"><DemoDataLabel /></p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">{user.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-700'
                : user.role === 'SUPERVISOR' ? 'bg-purple-100 text-purple-700'
                : user.role === 'OFFICER' ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4 text-gray-400" /> {user.name}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" /> {user.email}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-4 w-4 text-gray-400" /> {user.role}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" /> Joined {formatDate(user.createdAt)}
            </div>
            {user.reputationScore !== undefined && (
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-4 w-4 text-amber-400" /> {user.reputationScore} pts reputation
              </div>
            )}
            {user.verifiedReports !== undefined && (
              <div className="flex items-center gap-2 text-gray-600">
                <FileCheck className="h-4 w-4 text-green-500" /> {user.verifiedReports} verified reports
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
