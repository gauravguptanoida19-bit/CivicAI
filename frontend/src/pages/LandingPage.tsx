import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Brain, Map, AlertTriangle, GitMerge, FileText,
  Zap, Shield, BarChart3, Camera, CheckCircle, Clock, Users,
  ChevronRight, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoDataLabel } from '@/components/shared/DemoBanner'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

const STATS = [
  { label: 'Issues Detected', value: '12,400+', sub: 'across demo dataset' },
  { label: 'AI Accuracy', value: '91.3%', sub: 'detection confidence' },
  { label: 'Avg Resolution', value: '38h', sub: 'with AI triage' },
  { label: 'Wards Covered', value: '10', sub: 'in demo city' },
]

const FEATURES = [
  {
    icon: Camera,
    title: 'AI Vision Detection',
    description:
      'YOLO-powered computer vision automatically detects and classifies civic issues from photos — potholes, garbage, broken lights, and more.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Brain,
    title: 'Smart Prioritization',
    description:
      'Multi-factor severity engine scores every issue using type, location, traffic density, and proximity to sensitive infrastructure.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Map,
    title: 'Geospatial Intelligence',
    description:
      'PostGIS-backed spatial queries with interactive Leaflet maps, clustering, ward heatmaps, and real-time location tracking.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: GitMerge,
    title: 'Duplicate Detection',
    description:
      'ML-based deduplication prevents multiple departments from processing the same issue by linking nearby reports.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: FileText,
    title: 'AI Reports',
    description:
      'Gemini/GPT-powered generative AI creates structured incident reports with impact assessment and department recommendations.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: Zap,
    title: 'Real-Time Operations',
    description:
      'Socket.IO streams live issue feeds to admin dashboards — no refresh required. New reports appear instantly on the command center.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
]

const FLOW = [
  { step: '01', label: 'Citizen Report', desc: 'Photo upload via mobile or desktop' },
  { step: '02', label: 'AI Vision', desc: 'YOLO detects issue type + bounding box' },
  { step: '03', label: 'Classification', desc: 'Category, confidence, severity scored' },
  { step: '04', label: 'Geospatial', desc: 'GPS location indexed with PostGIS' },
  { step: '05', label: 'Duplicate Check', desc: 'ML deduplication against nearby reports' },
  { step: '06', label: 'Municipal Action', desc: 'Department assigned, officer notified' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="font-bold text-blue-900 text-lg">CivicAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-gray-900 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.03%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Smart City Platform
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Civic<span className="text-blue-300">AI</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-xl lg:text-2xl text-blue-200 font-medium mb-4">
              "See the Problem. Understand the Impact. Fix It Faster."
            </motion.p>

            <motion.p custom={3} variants={fadeUp} className="text-blue-300/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              An AI-powered civic intelligence platform that automatically detects, classifies, prioritizes, and manages infrastructure problems across cities — from potholes to broken streetlights.
            </motion.p>

            <motion.div custom={4} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="xl" className="bg-white text-blue-900 hover:bg-blue-50 gap-2 w-full sm:w-auto">
                  Report an Issue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login" onClick={() => {
                // Pre-fill admin credentials for demo
                localStorage.setItem('demo-hint', 'admin')
              }}>
                <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                  Explore Command Center
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.p custom={5} variants={fadeUp} className="mt-4 text-xs text-blue-400">
              Demo: citizen@demo.civicai · admin@demo.civicai · officer@demo.civicai (any password)
            </motion.p>
          </motion.div>
        </div>

        {/* AI Flow Visualization */}
        <div className="relative max-w-5xl mx-auto px-4 pb-16">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-0">
            {FLOW.map((item, i) => (
              <div key={item.step} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 min-w-[110px]">
                    <div className="text-xs text-blue-400 font-mono mb-1">{item.step}</div>
                    <div className="text-white font-semibold text-sm">{item.label}</div>
                    <div className="text-blue-300 text-xs mt-0.5">{item.desc}</div>
                  </div>
                </motion.div>
                {i < FLOW.length - 1 && (
                  <div className="hidden md:block mx-2 text-blue-500">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <DemoDataLabel />
            <p className="text-sm text-gray-500 mt-1">All statistics shown are from the demo dataset</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-xl p-6 shadow-sm border"
              >
                <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
                <div className="font-semibold text-gray-700 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Built for Smart Cities
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Six interconnected AI systems working together to transform how cities manage infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex rounded-lg p-3 ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              End-to-End Intelligence
            </h2>
            <p className="text-gray-500 text-lg">
              From a citizen photo to department resolution — fully automated.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { icon: Camera, title: 'Citizen uploads photo', desc: 'Mobile-friendly report form with GPS location capture' },
                { icon: Brain, title: 'AI analyzes in seconds', desc: 'YOLO detects the issue, severity engine scores risk factors' },
                { icon: GitMerge, title: 'Duplicates detected', desc: 'Nearby reports are merged to prevent redundant work' },
                { icon: Map, title: 'Mapped and assigned', desc: 'PostGIS indexes location, department automatically assigned' },
                { icon: CheckCircle, title: 'Resolved and tracked', desc: 'Citizens receive real-time status updates throughout' },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">AI Analysis Result</h4>
                <span className="text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded px-2 py-0.5 font-bold uppercase">Demo</span>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-blue-900">🕳️ Pothole Detected</div>
                      <div className="text-sm text-blue-700">Road surface damage — left driving lane</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-900">94%</div>
                      <div className="text-xs text-blue-600">Confidence</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-red-700">CRITICAL</div>
                    <div className="text-xs text-red-600">AI Severity</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="font-bold text-orange-700">Score: 82</div>
                    <div className="text-xs text-orange-600">out of 100</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <strong>AI Impact Assessment:</strong> Possible risk to two-wheelers and low-clearance vehicles. May cause loss of vehicle control at normal driving speeds.
                  <div className="text-xs text-gray-400 mt-1 italic">AI-generated assessment. Advisory only.</div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Recommended dept:</span>
                  <span className="font-semibold text-gray-900">Road Maintenance</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="h-3.5 w-3.5" />
                  Duplicate check: 2 nearby reports found & merged
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-blue-300 text-lg mb-8">
            The full demo runs in under 3 minutes. No setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="xl" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                Start as Citizen
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                Open Admin Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">CA</span>
            </div>
            <span className="text-white font-bold">CivicAI</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm">AI-Powered Smart City Intelligence</span>
          </div>
          <p className="text-xs text-gray-600">
            Built for demonstration purposes. All data is synthetic. MIT License.
          </p>
        </div>
      </footer>
    </div>
  )
}
