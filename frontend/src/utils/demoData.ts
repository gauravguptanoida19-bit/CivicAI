/**
 * DEMO DATA — All data in this file is SYNTHETIC/SIMULATED.
 * It does NOT represent real incidents, real people, or real city data.
 * Used for demonstration and testing purposes only.
 */

import type { CivicIssue, User, Department, AnalyticsSummary, Ward, Notification } from '@/types'

// Demo users
export const DEMO_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Aryan Sharma',
    email: 'citizen@demo.civicai',
    role: 'CITIZEN',
    reputationScore: 420,
    totalReports: 12,
    verifiedReports: 10,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-002',
    name: 'Priya Nair',
    email: 'officer@demo.civicai',
    role: 'OFFICER',
    departmentId: 'dept-001',
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-003',
    name: 'Raj Verma',
    email: 'admin@demo.civicai',
    role: 'ADMIN',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-004',
    name: 'Sunita Rao',
    email: 'supervisor@demo.civicai',
    role: 'SUPERVISOR',
    departmentId: 'dept-002',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
]

// Demo departments
export const DEMO_DEPARTMENTS: Department[] = [
  {
    id: 'dept-001',
    name: 'Road Maintenance',
    code: 'ROAD',
    description: 'Responsible for road repairs, potholes, and surface damage',
    issueTypes: ['POTHOLE', 'ROAD_DAMAGE'],
    officerCount: 12,
    activeIssues: 34,
    resolvedIssues: 187,
    averageResolutionHours: 48,
  },
  {
    id: 'dept-002',
    name: 'Sanitation',
    code: 'SAN',
    description: 'Waste collection, garbage accumulation, and illegal dumping',
    issueTypes: ['GARBAGE', 'ILLEGAL_DUMPING'],
    officerCount: 18,
    activeIssues: 22,
    resolvedIssues: 312,
    averageResolutionHours: 24,
  },
  {
    id: 'dept-003',
    name: 'Electrical',
    code: 'ELEC',
    description: 'Streetlights and electrical infrastructure',
    issueTypes: ['BROKEN_STREETLIGHT'],
    officerCount: 8,
    activeIssues: 15,
    resolvedIssues: 98,
    averageResolutionHours: 36,
  },
  {
    id: 'dept-004',
    name: 'Water Department',
    code: 'WATER',
    description: 'Water supply, leakages, and drainage',
    issueTypes: ['WATER_LEAKAGE', 'DRAINAGE_PROBLEM'],
    officerCount: 10,
    activeIssues: 19,
    resolvedIssues: 143,
    averageResolutionHours: 42,
  },
  {
    id: 'dept-005',
    name: 'Public Works',
    code: 'PWD',
    description: 'Open manholes, safety hazards, and infrastructure',
    issueTypes: ['OPEN_MANHOLE'],
    officerCount: 7,
    activeIssues: 8,
    resolvedIssues: 76,
    averageResolutionHours: 12,
  },
  {
    id: 'dept-006',
    name: 'Traffic Department',
    code: 'TRAFFIC',
    description: 'Traffic signals, signs, and road safety',
    issueTypes: ['DAMAGED_TRAFFIC_SIGN'],
    officerCount: 9,
    activeIssues: 11,
    resolvedIssues: 89,
    averageResolutionHours: 30,
  },
  {
    id: 'dept-007',
    name: 'Parks & Environment',
    code: 'PARKS',
    description: 'Trees, green spaces, and environmental hazards',
    issueTypes: ['FALLEN_TREE'],
    officerCount: 6,
    activeIssues: 5,
    resolvedIssues: 54,
    averageResolutionHours: 18,
  },
  {
    id: 'dept-008',
    name: 'General Services',
    code: 'GEN',
    description: 'Miscellaneous civic issues',
    issueTypes: ['OTHER'],
    officerCount: 5,
    activeIssues: 4,
    resolvedIssues: 31,
    averageResolutionHours: 72,
  },
]

// Base coordinates for demo issues (around New Delhi)
const BASE_LAT = 28.6139
const BASE_LNG = 77.2090

function demoLat(offset: number) { return BASE_LAT + offset }
function demoLng(offset: number) { return BASE_LNG + offset }

const wardNames = [
  'Ward 1 - Connaught Place', 'Ward 2 - Karol Bagh', 'Ward 3 - Lajpat Nagar',
  'Ward 4 - Dwarka', 'Ward 5 - Rohini', 'Ward 6 - Janakpuri',
  'Ward 7 - Saket', 'Ward 8 - Nehru Place', 'Ward 9 - Preet Vihar', 'Ward 10 - Pitampura',
]

// Generate 100+ demo civic issues
function makeIssue(
  id: string,
  num: number,
  type: CivicIssue['type'],
  ward: string,
  severity: CivicIssue['severity'],
  status: CivicIssue['status'],
  lat: number,
  lng: number,
  deptId: string,
  hoursAgo: number,
): CivicIssue {
  const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString()
  const typeLabels: Record<string, string> = {
    POTHOLE: 'Pothole', GARBAGE: 'Garbage Accumulation', BROKEN_STREETLIGHT: 'Broken Streetlight',
    ROAD_DAMAGE: 'Road Damage', WATER_LEAKAGE: 'Water Leakage', OPEN_MANHOLE: 'Open Manhole',
    FALLEN_TREE: 'Fallen Tree', DAMAGED_TRAFFIC_SIGN: 'Damaged Traffic Sign',
    ILLEGAL_DUMPING: 'Illegal Dumping', DRAINAGE_PROBLEM: 'Drainage Problem', OTHER: 'Other Issue',
  }
  const scoreMap: Record<string, number> = { LOW: 15, MEDIUM: 38, HIGH: 62, CRITICAL: 88 }

  return {
    id,
    issueNumber: `CIV-${String(num).padStart(4, '0')}`,
    type,
    category: 'ROAD',
    title: `${typeLabels[type] ?? type} near ${ward}`,
    description: `A ${(typeLabels[type] ?? type).toLowerCase()} has been reported in ${ward}. Immediate attention may be required.`,
    location: {
      latitude: lat,
      longitude: lng,
      address: `Main Road, ${ward}`,
      ward,
      city: 'Demo City',
    },
    severity,
    severityScore: scoreMap[severity] ?? 50,
    status,
    imageUrl: `/demo/issue-${(num % 10) + 1}.jpg`,
    aiAnalysis: {
      issueType: type,
      confidence: 0.7 + Math.random() * 0.28,
      severityScore: scoreMap[severity] ?? 50,
      severity,
      category: 'ROAD',
      description: `AI analysis detected a ${(typeLabels[type] ?? type).toLowerCase()} with ${severity.toLowerCase()} severity.`,
      potentialImpact: `May impact ${severity === 'CRITICAL' ? 'major' : 'moderate'} traffic flow and pedestrian safety.`,
      recommendedDepartment: DEMO_DEPARTMENTS.find(d => d.id === deptId)?.name ?? 'General Services',
      severityFactors: [
        { factor: 'Issue Type', score: 30, description: `${typeLabels[type]} typically scores high` },
        { factor: 'Location Risk', score: 20, description: 'Near main road' },
        { factor: 'Duration', score: 15, description: `Reported ${hoursAgo > 48 ? hoursAgo/24 + ' days' : hoursAgo + ' hours'} ago` },
      ],
      isDemoMode: true,
    },
    reportedBy: DEMO_USERS[0],
    assignedTo: status !== 'REPORTED' ? DEMO_USERS[1] : undefined,
    department: DEMO_DEPARTMENTS.find(d => d.id === deptId),
    duplicateCount: Math.floor(Math.random() * 3),
    reportCount: 1 + Math.floor(Math.random() * 4),
    timeline: [
      {
        id: `tl-${id}-1`,
        event: 'Issue Reported',
        description: 'Citizen submitted report with image evidence',
        performedBy: DEMO_USERS[0],
        timestamp: createdAt,
        type: 'REPORTED',
      },
      ...(status !== 'REPORTED' ? [{
        id: `tl-${id}-2`,
        event: 'AI Analysis Complete',
        description: `AI detected ${typeLabels[type]} with ${((0.7 + Math.random() * 0.28) * 100).toFixed(0)}% confidence`,
        timestamp: new Date(new Date(createdAt).getTime() + 2 * 60000).toISOString(),
        type: 'AI_ANALYZED' as const,
      }] : []),
      ...(status === 'ASSIGNED' || status === 'IN_PROGRESS' || status === 'RESOLVED' ? [{
        id: `tl-${id}-3`,
        event: 'Department Assigned',
        description: `Assigned to ${DEMO_DEPARTMENTS.find(d => d.id === deptId)?.name}`,
        performedBy: DEMO_USERS[3],
        timestamp: new Date(new Date(createdAt).getTime() + 30 * 60000).toISOString(),
        type: 'ASSIGNED' as const,
      }] : []),
      ...(status === 'RESOLVED' ? [{
        id: `tl-${id}-4`,
        event: 'Issue Resolved',
        description: 'Officer confirmed resolution with photo evidence',
        performedBy: DEMO_USERS[1],
        timestamp: new Date(new Date(createdAt).getTime() + 72 * 3600000).toISOString(),
        type: 'RESOLVED' as const,
      }] : []),
    ],
    createdAt,
    updatedAt: new Date(Date.now() - Math.random() * 24 * 3600 * 1000).toISOString(),
    isDemoData: true,
  }
}

export const DEMO_ISSUES: CivicIssue[] = [
  makeIssue('iss-001', 1042, 'POTHOLE', wardNames[3], 'CRITICAL', 'IN_PROGRESS', demoLat(0.02), demoLng(-0.03), 'dept-001', 14),
  makeIssue('iss-002', 1043, 'GARBAGE', wardNames[6], 'HIGH', 'ASSIGNED', demoLat(-0.01), demoLng(0.04), 'dept-002', 8),
  makeIssue('iss-003', 1044, 'BROKEN_STREETLIGHT', wardNames[1], 'MEDIUM', 'REPORTED', demoLat(0.05), demoLng(0.01), 'dept-003', 3),
  makeIssue('iss-004', 1045, 'WATER_LEAKAGE', wardNames[0], 'HIGH', 'AI_ANALYZED', demoLat(-0.02), demoLng(-0.01), 'dept-004', 6),
  makeIssue('iss-005', 1046, 'OPEN_MANHOLE', wardNames[4], 'CRITICAL', 'ASSIGNED', demoLat(0.03), demoLng(0.05), 'dept-005', 2),
  makeIssue('iss-006', 1047, 'ROAD_DAMAGE', wardNames[2], 'HIGH', 'IN_PROGRESS', demoLat(-0.04), demoLng(0.02), 'dept-001', 48),
  makeIssue('iss-007', 1048, 'FALLEN_TREE', wardNames[5], 'MEDIUM', 'RESOLVED', demoLat(0.01), demoLng(-0.05), 'dept-007', 72),
  makeIssue('iss-008', 1049, 'DAMAGED_TRAFFIC_SIGN', wardNames[7], 'LOW', 'VERIFIED', demoLat(0.06), demoLng(0.03), 'dept-006', 12),
  makeIssue('iss-009', 1050, 'ILLEGAL_DUMPING', wardNames[8], 'HIGH', 'ASSIGNED', demoLat(-0.03), demoLng(-0.04), 'dept-002', 24),
  makeIssue('iss-010', 1051, 'DRAINAGE_PROBLEM', wardNames[9], 'CRITICAL', 'IN_PROGRESS', demoLat(0.04), demoLng(-0.02), 'dept-004', 36),
  makeIssue('iss-011', 1052, 'POTHOLE', wardNames[1], 'HIGH', 'ASSIGNED', demoLat(-0.05), demoLng(0.06), 'dept-001', 20),
  makeIssue('iss-012', 1053, 'GARBAGE', wardNames[4], 'MEDIUM', 'RESOLVED', demoLat(0.02), demoLng(-0.06), 'dept-002', 120),
  makeIssue('iss-013', 1054, 'BROKEN_STREETLIGHT', wardNames[6], 'LOW', 'REPORTED', demoLat(-0.01), demoLng(0.07), 'dept-003', 5),
  makeIssue('iss-014', 1055, 'POTHOLE', wardNames[3], 'CRITICAL', 'IN_PROGRESS', demoLat(0.07), demoLng(-0.01), 'dept-001', 18),
  makeIssue('iss-015', 1056, 'WATER_LEAKAGE', wardNames[7], 'HIGH', 'IN_PROGRESS', demoLat(-0.06), demoLng(-0.03), 'dept-004', 30),
  makeIssue('iss-016', 1057, 'ROAD_DAMAGE', wardNames[0], 'MEDIUM', 'VERIFIED', demoLat(0.03), demoLng(0.08), 'dept-001', 60),
  makeIssue('iss-017', 1058, 'ILLEGAL_DUMPING', wardNames[2], 'HIGH', 'REPORTED', demoLat(-0.07), demoLng(0.04), 'dept-002', 4),
  makeIssue('iss-018', 1059, 'OPEN_MANHOLE', wardNames[5], 'CRITICAL', 'ASSIGNED', demoLat(0.05), demoLng(-0.07), 'dept-005', 7),
  makeIssue('iss-019', 1060, 'DRAINAGE_PROBLEM', wardNames[8], 'MEDIUM', 'RESOLVED', demoLat(-0.04), demoLng(0.09), 'dept-004', 200),
  makeIssue('iss-020', 1061, 'FALLEN_TREE', wardNames[9], 'LOW', 'RESOLVED', demoLat(0.08), demoLng(-0.04), 'dept-007', 180),
  // 80 more abbreviated issues
  ...Array.from({ length: 80 }, (_, i) => {
    const types: CivicIssue['type'][] = ['POTHOLE', 'GARBAGE', 'BROKEN_STREETLIGHT', 'ROAD_DAMAGE', 'WATER_LEAKAGE', 'OPEN_MANHOLE', 'FALLEN_TREE', 'DAMAGED_TRAFFIC_SIGN', 'ILLEGAL_DUMPING', 'DRAINAGE_PROBLEM']
    const severities: CivicIssue['severity'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    const statuses: CivicIssue['status'][] = ['REPORTED', 'AI_ANALYZED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']
    const depts = ['dept-001', 'dept-002', 'dept-003', 'dept-004', 'dept-005', 'dept-006', 'dept-007']
    const idx = i + 21
    return makeIssue(
      `iss-${String(idx).padStart(3, '0')}`,
      1041 + idx,
      types[i % types.length],
      wardNames[i % wardNames.length],
      severities[i % severities.length],
      statuses[i % statuses.length],
      demoLat((Math.random() - 0.5) * 0.2),
      demoLng((Math.random() - 0.5) * 0.2),
      depts[i % depts.length],
      Math.floor(Math.random() * 168),
    )
  }),
]

export const DEMO_ANALYTICS: AnalyticsSummary = {
  totalReports: 1247,
  openIssues: 118,
  criticalIssues: 23,
  resolvedToday: 14,
  averageResolutionHours: 38.4,
  aiDetectionAccuracy: 91.3,
  duplicateDetectionRate: 18.7,
  wardCount: 10,
}

export const DEMO_WARDS: Ward[] = wardNames.map((name, i) => ({
  id: `ward-${i + 1}`,
  name,
  code: `W${i + 1}`,
  city: 'Demo City',
  issueCount: 8 + Math.floor(Math.random() * 25),
  criticalCount: Math.floor(Math.random() * 6),
}))

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'CRITICAL',
    title: 'Critical Issue Reported',
    message: 'Open manhole detected in Ward 5 — immediate action required',
    isRead: false,
    issueId: 'iss-005',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'SUCCESS',
    title: 'Issue Resolved',
    message: 'Fallen tree in Ward 6 has been successfully cleared (CIV-1048)',
    isRead: false,
    issueId: 'iss-007',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'INFO',
    title: 'New Report Assigned',
    message: 'Pothole CIV-1042 has been assigned to Road Maintenance',
    isRead: true,
    issueId: 'iss-001',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-004',
    type: 'WARNING',
    title: 'Duplicate Detected',
    message: '3 reports for the same pothole in Ward 4 have been merged',
    isRead: true,
    issueId: 'iss-001',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
]

// Demo AI analyses for image upload simulation
export const DEMO_AI_RESULTS = [
  {
    issueType: 'POTHOLE' as const,
    confidence: 0.94,
    boundingBox: { x: 120, y: 150, width: 280, height: 180 },
    severityScore: 82,
    severity: 'CRITICAL' as const,
    category: 'ROAD' as const,
    description: 'Large road-surface depression detected in the driving lane. Significant structural damage visible with depth estimated at 8-12cm.',
    potentialImpact: 'High risk to two-wheelers and low-clearance vehicles. May cause loss of vehicle control at normal driving speeds.',
    recommendedDepartment: 'Road Maintenance',
    severityFactors: [
      { factor: 'Issue Type', score: 30, description: 'Potholes are high-priority road hazards' },
      { factor: 'Estimated Size', score: 20, description: 'Large area detected (estimated >0.5m²)' },
      { factor: 'Road Type', score: 25, description: 'Main arterial road with high traffic volume' },
      { factor: 'Proximity Risk', score: 7, description: 'Within 200m of school zone' },
    ],
    isDemoMode: true,
  },
  {
    issueType: 'GARBAGE' as const,
    confidence: 0.87,
    boundingBox: { x: 80, y: 100, width: 320, height: 220 },
    severityScore: 55,
    severity: 'HIGH' as const,
    category: 'WASTE' as const,
    description: 'Significant garbage accumulation detected. Mixed waste visible including plastic, organic material, and construction debris.',
    potentialImpact: 'Public health hazard and potential breeding ground for disease vectors. Blocks pedestrian pathway.',
    recommendedDepartment: 'Sanitation',
    severityFactors: [
      { factor: 'Waste Volume', score: 25, description: 'Large accumulation detected' },
      { factor: 'Waste Type', score: 15, description: 'Mixed hazardous and non-hazardous' },
      { factor: 'Location', score: 15, description: 'Near residential area' },
    ],
    isDemoMode: true,
  },
]

export function getDemoAIResult(index = 0) {
  return DEMO_AI_RESULTS[index % DEMO_AI_RESULTS.length]
}
