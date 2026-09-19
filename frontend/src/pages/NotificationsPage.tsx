import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/store/notificationStore'
import { formatTimeAgo } from '@/utils/helpers'
import type { NotificationType } from '@/types'
import { cn } from '@/utils/helpers'

const TYPE_STYLES: Record<NotificationType, { bg: string; border: string; dot: string }> = {
  INFO: { bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500' },
  SUCCESS: { bg: 'bg-green-50', border: 'border-green-100', dot: 'bg-green-500' },
  WARNING: { bg: 'bg-yellow-50', border: 'border-yellow-100', dot: 'bg-yellow-500' },
  CRITICAL: { bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' },
}

export function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead, clearAll } = useNotificationStore()
  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </h1>
          <p className="text-gray-500 text-sm">{unread} unread</p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700" onClick={clearAll}>
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {!notifications.length ? (
            <div className="py-12 text-center text-gray-400">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const style = TYPE_STYLES[n.type]
              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    'flex items-start gap-4 p-4 border-b last:border-0 cursor-pointer transition-colors',
                    !n.isRead ? style.bg : 'hover:bg-gray-50'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full mt-2 flex-shrink-0', style.dot)} />
                  <div className="flex-1">
                    <p className={cn('font-semibold text-sm', !n.isRead ? 'text-gray-900' : 'text-gray-700')}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
