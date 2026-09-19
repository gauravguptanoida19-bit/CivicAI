import axios from 'axios'
import type { AIAnalysisResult, IssueType, IssueSeverity, IssueCategory } from '../types'
import { logger } from '../utils/logger'

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'
const DEMO_MODE = process.env.DEMO_MODE === 'true' || process.env.ML_DEMO_MODE === 'true'

// Demo AI results for when ML service is unavailable
const DEMO_RESULTS: Record<string, AIAnalysisResult> = {
  POTHOLE: {
    issueType: 'POTHOLE',
    confidence: 0.94,
    boundingBox: { x: 120, y: 150, width: 280, height: 180 },
    severityScore: 82,
    severity: 'CRITICAL',
    category: 'ROAD',
    description: 'Large road-surface depression detected in the driving lane. Significant structural damage visible.',
    potentialImpact: 'Possible risk to two-wheelers and low-clearance vehicles at normal driving speeds.',
    recommendedDepartment: 'Road Maintenance',
    severityFactors: [
      { factor: 'Issue Type', score: 30, description: 'Potholes are high-priority road hazards' },
      { factor: 'Estimated Size', score: 20, description: 'Large area detected (>0.5m²)' },
      { factor: 'Road Type', score: 25, description: 'Main arterial road' },
      { factor: 'Proximity Risk', score: 7, description: 'Near infrastructure zone' },
    ],
    isDemoMode: true,
  },
  GARBAGE: {
    issueType: 'GARBAGE',
    confidence: 0.87,
    boundingBox: { x: 80, y: 100, width: 320, height: 220 },
    severityScore: 55,
    severity: 'HIGH',
    category: 'WASTE',
    description: 'Significant garbage accumulation detected. Mixed waste including plastic and organic material.',
    potentialImpact: 'Public health hazard. Possible breeding ground for disease vectors.',
    recommendedDepartment: 'Sanitation',
    severityFactors: [
      { factor: 'Waste Volume', score: 25, description: 'Large accumulation' },
      { factor: 'Waste Type', score: 15, description: 'Mixed hazardous and non-hazardous' },
      { factor: 'Location', score: 15, description: 'Near residential area' },
    ],
    isDemoMode: true,
  },
}

function getDemoResult(hint?: string): AIAnalysisResult {
  if (hint && DEMO_RESULTS[hint.toUpperCase()]) return DEMO_RESULTS[hint.toUpperCase()]
  const keys = Object.keys(DEMO_RESULTS)
  return DEMO_RESULTS[keys[Math.floor(Math.random() * keys.length)]]
}

export const mlService = {
  async analyzeImage(imagePath: string, issueTypeHint?: string): Promise<AIAnalysisResult> {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 1500))
      return getDemoResult(issueTypeHint)
    }

    try {
      const FormData = (await import('form-data')).default
      const fs = await import('fs')
      const form = new FormData()
      form.append('image', fs.createReadStream(imagePath))
      if (issueTypeHint) form.append('hint', issueTypeHint)

      const response = await axios.post<AIAnalysisResult>(`${ML_URL}/analyze-image`, form, {
        headers: form.getHeaders(),
        timeout: 30000,
      })
      return response.data
    } catch (err) {
      logger.warn('ML service unavailable, using demo result:', err)
      return getDemoResult(issueTypeHint)
    }
  },

  async detectDuplicates(
    issueId: string,
    lat: number,
    lng: number,
    type: IssueType,
    imagePath?: string
  ): Promise<{ isDuplicate: boolean; masterIssueId?: string; confidence: number; nearbyCount: number }> {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 500))
      const isDuplicate = Math.random() > 0.7
      return {
        isDuplicate,
        masterIssueId: isDuplicate ? 'iss-001' : undefined,
        confidence: isDuplicate ? 0.78 + Math.random() * 0.2 : 0,
        nearbyCount: isDuplicate ? Math.floor(Math.random() * 3) + 1 : 0,
      }
    }

    try {
      const response = await axios.post(`${ML_URL}/detect-duplicate`, {
        issue_id: issueId, lat, lng, issue_type: type, image_path: imagePath,
      }, { timeout: 10000 })
      return response.data
    } catch {
      return { isDuplicate: false, confidence: 0, nearbyCount: 0 }
    }
  },

  async estimateSeverity(
    type: IssueType,
    confidence: number,
    location: { lat: number; lng: number; ward: string },
    duplicateCount: number
  ): Promise<{ score: number; severity: IssueSeverity; factors: AIAnalysisResult['severityFactors'] }> {
    // Severity engine — pure logic, no external call needed
    const BASE_SCORES: Record<string, number> = {
      OPEN_MANHOLE: 40, POTHOLE: 30, ROAD_DAMAGE: 28, WATER_LEAKAGE: 25,
      DRAINAGE_PROBLEM: 22, BROKEN_STREETLIGHT: 18, GARBAGE: 20,
      ILLEGAL_DUMPING: 18, DAMAGED_TRAFFIC_SIGN: 15, FALLEN_TREE: 12, OTHER: 10,
    }

    const factors: AIAnalysisResult['severityFactors'] = []
    let score = 0

    // Issue type
    const typeScore = BASE_SCORES[type] || 10
    score += typeScore
    factors.push({ factor: 'Issue Type', score: typeScore, description: `${type} base risk score` })

    // AI confidence
    const confScore = Math.round(confidence * 15)
    score += confScore
    factors.push({ factor: 'Detection Confidence', score: confScore, description: `${(confidence * 100).toFixed(0)}% AI confidence` })

    // Duplicate reports boost
    if (duplicateCount > 0) {
      const dupScore = Math.min(duplicateCount * 5, 20)
      score += dupScore
      factors.push({ factor: 'Multiple Reports', score: dupScore, description: `${duplicateCount} duplicate reports confirmed` })
    }

    // Location risk (simplified)
    const locScore = Math.floor(Math.random() * 10) + 5
    score += locScore
    factors.push({ factor: 'Location Risk', score: locScore, description: 'Road classification and zone' })

    score = Math.min(100, score)

    const severity: IssueSeverity = score >= 76 ? 'CRITICAL' : score >= 51 ? 'HIGH' : score >= 26 ? 'MEDIUM' : 'LOW'

    return { score, severity, factors }
  },

  async generateDescription(
    type: IssueType,
    severity: IssueSeverity,
    location: string,
    confidence: number
  ): Promise<string> {
    // Try Gemini/OpenAI if key available
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
    if (apiKey && !DEMO_MODE) {
      try {
        if (process.env.GEMINI_API_KEY) {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${process.env.AI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              contents: [{
                parts: [{
                  text: `Generate a concise civic issue description for: Type=${type}, Severity=${severity}, Location=${location}, AI Confidence=${(confidence * 100).toFixed(0)}%. Keep under 100 words. Note this is an AI-generated assessment.`,
                }],
              }],
            },
            { timeout: 10000 }
          )
          return response.data.candidates?.[0]?.content?.parts?.[0]?.text || getDefaultDescription(type, severity)
        }
      } catch (err) {
        logger.warn('GenAI unavailable, using template description')
      }
    }

    return getDefaultDescription(type, severity)
  },

  async healthCheck(): Promise<boolean> {
    if (DEMO_MODE) return true
    try {
      const response = await axios.get(`${ML_URL}/health`, { timeout: 5000 })
      return response.status === 200
    } catch {
      return false
    }
  },
}

function getDefaultDescription(type: IssueType, severity: IssueSeverity): string {
  const descriptions: Partial<Record<IssueType, string>> = {
    POTHOLE: 'Road surface damage detected. Structural defect may pose hazard to vehicles and pedestrians.',
    GARBAGE: 'Waste accumulation identified. Sanitation intervention needed to prevent health risks.',
    BROKEN_STREETLIGHT: 'Non-functional streetlight detected. Reduced visibility may impact road safety at night.',
    ROAD_DAMAGE: 'Road surface deterioration observed. Infrastructure repair required.',
    WATER_LEAKAGE: 'Water leakage detected. May indicate pipe damage requiring urgent inspection.',
    OPEN_MANHOLE: 'Exposed manhole cover detected. Immediate safety hazard — area should be cordoned off.',
    FALLEN_TREE: 'Fallen tree or branch blocking area. Removal required for safe passage.',
    DAMAGED_TRAFFIC_SIGN: 'Damaged or missing traffic sign. May create traffic safety issues.',
    ILLEGAL_DUMPING: 'Unauthorized waste disposal identified. Environmental and health compliance action needed.',
    DRAINAGE_PROBLEM: 'Blocked or damaged drainage detected. May cause flooding during rainfall.',
  }
  const base = descriptions[type] || 'Civic infrastructure issue detected requiring municipal attention.'
  return `[${severity} severity — AI generated, advisory only] ${base}`
}
