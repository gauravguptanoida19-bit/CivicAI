import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/hooks/useToast'

const DEMO_ACCOUNTS = [
  { label: 'Citizen', email: 'citizen@demo.civicai', role: 'CITIZEN' },
  { label: 'Admin', email: 'admin@demo.civicai', role: 'ADMIN' },
  { label: 'Officer', email: 'officer@demo.civicai', role: 'OFFICER' },
  { label: 'Supervisor', email: 'supervisor@demo.civicai', role: 'SUPERVISOR' },
]

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('demo')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      setAuth(res.user, res.token)
      toast({ title: `Welcome back, ${res.user.name.split(' ')[0]}!`, variant: 'success' as never })
      const role = res.user.role
      if (role === 'ADMIN' || role === 'SUPERVISOR') navigate('/admin/dashboard')
      else if (role === 'OFFICER') navigate('/officer/dashboard')
      else navigate('/citizen/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const loginAs = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword('demo')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 to-indigo-900 text-white flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="font-bold text-sm">CA</span>
          </div>
          <span className="font-bold text-xl">CivicAI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Smart City<br />Intelligence<br />Platform
          </h2>
          <p className="text-blue-300 text-lg">
            AI-powered infrastructure management for modern cities.
          </p>
        </div>
        <div className="text-blue-400 text-sm">
          Demo mode active · All data is synthetic
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">CA</span>
              </div>
              <span className="font-bold text-blue-900">CivicAI</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-500 mt-1">Access your CivicAI dashboard</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wide">
              Demo Accounts (any password)
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => loginAs(acc)}
                  className="px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-md hover:bg-amber-100 transition-colors text-amber-900 font-medium"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register as citizen
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
