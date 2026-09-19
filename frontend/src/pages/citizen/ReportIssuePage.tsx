import { useState, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, MapPin, Brain, CheckCircle, ArrowRight, ArrowLeft,
  Loader2, X, AlertTriangle, Navigation, ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { issueService } from '@/services/issueService'
import { toast } from '@/hooks/useToast'
import type { AIAnalysis, Location, IssueType } from '@/types'
import { ISSUE_TYPE_CONFIG } from '@/utils/constants'

const STEPS = [
  { id: 1, label: 'Upload Media', icon: Upload },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'AI Analysis', icon: Brain },
  { id: 4, label: 'Confirm', icon: CheckCircle },
]

export function ReportIssuePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedType = searchParams.get('type') as IssueType | null

  const [step, setStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [locating, setLocating] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [description, setDescription] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload an image file', variant: 'destructive' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum image size is 10MB', variant: 'destructive' })
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: manualAddress || 'Location captured via GPS',
          ward: 'Ward 4',
          city: 'Demo City',
        })
        setLocating(false)
        toast({ title: 'Location captured', variant: 'success' as never })
      },
      () => {
        // Fallback: use demo location
        setLocation({
          latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
          longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
          address: manualAddress || 'Demo Location, Main Road',
          ward: 'Ward 4',
          city: 'Demo City',
        })
        setLocating(false)
        toast({ title: 'Using demo location', description: 'GPS unavailable — demo coordinates used', variant: 'warning' as never })
      },
      { timeout: 8000 }
    )
  }

  const runAIAnalysis = async () => {
    if (!imageFile) return
    setAnalyzing(true)
    try {
      const result = await issueService.analyzeImage(imageFile)
      setAiAnalysis(result)
      // Simulate duplicate detection
      setTimeout(() => setDuplicateWarning(Math.random() > 0.6), 800)
    } catch {
      toast({ title: 'AI analysis failed', description: 'Using manual classification', variant: 'destructive' })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleNext = async () => {
    if (step === 2 && !location) {
      // Auto-set demo location
      setLocation({
        latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
        longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
        address: manualAddress || 'Demo Location, Main Road',
        ward: 'Ward 4',
        city: 'Demo City',
      })
    }
    if (step === 2 && imageFile) {
      setStep(3)
      await runAIAnalysis()
      return
    }
    if (step < STEPS.length) setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!location) return
    setSubmitting(true)
    try {
      const issue = await issueService.createIssue({
        imageFile: imageFile || undefined,
        location,
        description,
        issueType: aiAnalysis?.issueType || preselectedType || 'OTHER',
        aiAnalysis: aiAnalysis || undefined,
      })
      toast({ title: `Issue ${issue.issueNumber} submitted!`, description: 'AI is processing your report', variant: 'success' as never })
      navigate(`/citizen/issues/${issue.id}`)
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const tc = aiAnalysis ? ISSUE_TYPE_CONFIG[aiAnalysis.issueType] : null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h1>
        <p className="text-gray-500 mt-0.5 flex items-center gap-2">
          AI-assisted reporting <DemoDataLabel />
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                step > s.id ? 'bg-green-500 border-green-500 text-white'
                : step === s.id ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {step > s.id ? <CheckCircle className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className={`text-xs mt-1 font-medium hidden sm:block ${step === s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Upload */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Upload Photo or Video</h2>
                {!imagePreview ? (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-300 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Drop image here or click to browse</p>
                    <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP · Max 10MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Upload preview" className="w-full rounded-lg object-cover max-h-72" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null) }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {imageFile?.name}
                    </div>
                  </div>
                )}

                <p className="text-xs text-amber-600 mt-4 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  In demo mode, AI will simulate analysis regardless of actual image content.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => navigate('/citizen/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!imagePreview}>
                Next: Location <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Capture Location</h2>

                <Button onClick={getLocation} disabled={locating} variant="outline" className="w-full gap-2">
                  {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  {locating ? 'Getting location...' : 'Use My Current Location'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-400">or enter manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="e.g. 42 Main Road, Ward 4"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                  />
                </div>

                {location && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                      <CheckCircle className="h-4 w-4" />
                      Location Set
                    </div>
                    <p className="text-green-600">{location.address}</p>
                    <p className="text-green-500 text-xs mt-0.5">
                      {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)} · {location.ward}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Additional Description (optional)</Label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Any additional details about the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext}>
                Next: AI Analysis <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: AI Analysis */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  AI Vision Analysis
                  <DemoDataLabel />
                </h2>

                {analyzing ? (
                  <div className="py-12 text-center">
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                      <Brain className="h-6 w-6 text-blue-600 absolute inset-0 m-auto" />
                    </div>
                    <p className="font-semibold text-gray-700">AI is analyzing your image...</p>
                    <p className="text-gray-400 text-sm mt-1">Running YOLO detection · Scoring severity · Checking duplicates</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-4">
                    {/* Detection result */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tc?.emoji}</span>
                          <div>
                            <p className="font-bold text-blue-900 text-lg">{tc?.label || aiAnalysis.issueType}</p>
                            <p className="text-blue-600 text-sm">Category: {aiAnalysis.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-900">
                            {(aiAnalysis.confidence * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-blue-600">Confidence</div>
                        </div>
                      </div>
                    </div>

                    {/* Severity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border rounded-lg p-3 text-center">
                        <SeverityBadge severity={aiAnalysis.severity} size="lg" />
                        <p className="text-xs text-gray-500 mt-1">AI Severity</p>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-gray-900">{aiAnalysis.severityScore}/100</p>
                        <p className="text-xs text-gray-500">Priority Score</p>
                      </div>
                    </div>

                    {/* AI Description */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-700">AI Description</p>
                      <p className="text-sm text-gray-600">{aiAnalysis.description}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-2">Possible Impact</p>
                      <p className="text-sm text-gray-600">{aiAnalysis.potentialImpact}</p>
                      <p className="text-xs text-gray-400 italic mt-1">
                        AI-generated assessment. Advisory only — not an objective determination.
                      </p>
                    </div>

                    {/* Severity factors */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Score Breakdown</p>
                      <div className="space-y-2">
                        {aiAnalysis.severityFactors.map((f) => (
                          <div key={f.factor} className="flex items-center gap-3">
                            <div className="w-28 text-xs text-gray-500 truncate">{f.factor}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-blue-500"
                                style={{ width: `${(f.score / 30) * 100}%` }}
                              />
                            </div>
                            <div className="w-8 text-xs font-mono text-gray-600 text-right">+{f.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <span className="text-sm text-gray-500">Recommended Department</span>
                      <span className="font-semibold text-sm text-gray-900">{aiAnalysis.recommendedDepartment}</span>
                    </div>

                    {/* Duplicate warning */}
                    {duplicateWarning && (
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Possible duplicate detected</p>
                          <p className="text-yellow-700">2 similar reports found within 100m. Your report will be linked to the existing issue.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Analysis not available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={analyzing}>
                Review & Submit <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Review & Submit</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {imagePreview && (
                    <div className="col-span-2">
                      <img src={imagePreview} alt="Evidence" className="w-full h-36 object-cover rounded-lg" />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Issue Type</p>
                    <p className="font-semibold">{aiAnalysis ? ISSUE_TYPE_CONFIG[aiAnalysis.issueType]?.label : 'Auto-detected'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">AI Severity</p>
                    {aiAnalysis && <SeverityBadge severity={aiAnalysis.severity} />}
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold">{location?.address || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ward</p>
                    <p className="font-semibold">{location?.ward || 'Auto-assigned'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Department</p>
                    <p className="font-semibold">{aiAnalysis?.recommendedDepartment || 'Auto-assigned'}</p>
                  </div>
                  {description && (
                    <div className="col-span-2">
                      <p className="text-gray-500">Your Description</p>
                      <p className="text-gray-700">{description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  By submitting, you confirm this is an accurate report. Misuse may affect your reputation score.
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleSubmit} loading={submitting} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Submit Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
