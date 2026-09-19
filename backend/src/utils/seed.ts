/**
 * Database seed script — populates demo data.
 * All data is SYNTHETIC. Does NOT represent real incidents or people.
 * Run: npm run seed
 */
import { db } from '../services/database'
import { hashPassword } from '../services/authService'
import { logger } from './logger'
import { v4 as uuidv4 } from 'uuid'

const DEMO_WARDS = [
  'Ward 1 - Connaught Place', 'Ward 2 - Karol Bagh', 'Ward 3 - Lajpat Nagar',
  'Ward 4 - Dwarka', 'Ward 5 - Rohini', 'Ward 6 - Janakpuri',
  'Ward 7 - Saket', 'Ward 8 - Nehru Place', 'Ward 9 - Preet Vihar', 'Ward 10 - Pitampura',
]

const ISSUE_TYPES = [
  'POTHOLE', 'GARBAGE', 'BROKEN_STREETLIGHT', 'ROAD_DAMAGE',
  'WATER_LEAKAGE', 'OPEN_MANHOLE', 'FALLEN_TREE', 'DAMAGED_TRAFFIC_SIGN',
  'ILLEGAL_DUMPING', 'DRAINAGE_PROBLEM',
]

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['REPORTED', 'AI_ANALYZED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']

async function seed() {
  logger.info('[Seed] Starting demo data seed...')

  // Users
  const citizenPw = await hashPassword('demo')
  const adminPw = await hashPassword('demo')

  const users = [
    { id: uuidv4(), name: 'Aryan Sharma', email: 'citizen@demo.civicai', password_hash: citizenPw, role: 'CITIZEN', reputation_score: 420 },
    { id: uuidv4(), name: 'Priya Nair', email: 'officer@demo.civicai', password_hash: citizenPw, role: 'OFFICER' },
    { id: uuidv4(), name: 'Raj Verma', email: 'admin@demo.civicai', password_hash: adminPw, role: 'ADMIN' },
    { id: uuidv4(), name: 'Sunita Rao', email: 'supervisor@demo.civicai', password_hash: adminPw, role: 'SUPERVISOR' },
  ]

  for (const u of users) {
    await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, reputation_score, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
       ON CONFLICT (email) DO NOTHING`,
      [u.id, u.name, u.email, u.password_hash, u.role, (u as { reputation_score?: number }).reputation_score || 0]
    )
  }

  // Departments
  const departments = [
    { id: uuidv4(), name: 'Road Maintenance', code: 'ROAD', description: 'Road repairs and potholes' },
    { id: uuidv4(), name: 'Sanitation', code: 'SAN', description: 'Waste and garbage management' },
    { id: uuidv4(), name: 'Electrical', code: 'ELEC', description: 'Streetlights and electrical' },
    { id: uuidv4(), name: 'Water Department', code: 'WATER', description: 'Water supply and drainage' },
    { id: uuidv4(), name: 'Public Works', code: 'PWD', description: 'Infrastructure and safety' },
    { id: uuidv4(), name: 'Traffic Department', code: 'TRAFFIC', description: 'Traffic management' },
    { id: uuidv4(), name: 'Parks & Environment', code: 'PARKS', description: 'Green spaces and trees' },
    { id: uuidv4(), name: 'General Services', code: 'GEN', description: 'Miscellaneous civic services' },
  ]

  for (const d of departments) {
    await db.query(
      `INSERT INTO departments (id, name, code, description, created_at)
       VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (code) DO NOTHING`,
      [d.id, d.name, d.code, d.description]
    )
  }

  // Issues
  const citizenId = users[0].id
  const BASE_LAT = 28.6139
  const BASE_LNG = 77.209

  for (let i = 0; i < 100; i++) {
    const issueId = uuidv4()
    const type = ISSUE_TYPES[i % ISSUE_TYPES.length]
    const severity = SEVERITIES[i % SEVERITIES.length]
    const status = STATUSES[i % STATUSES.length]
    const ward = DEMO_WARDS[i % DEMO_WARDS.length]
    const lat = BASE_LAT + (Math.random() - 0.5) * 0.2
    const lng = BASE_LNG + (Math.random() - 0.5) * 0.2
    const severityScore = severity === 'CRITICAL' ? 80 + Math.floor(Math.random() * 20)
      : severity === 'HIGH' ? 51 + Math.floor(Math.random() * 24)
      : severity === 'MEDIUM' ? 26 + Math.floor(Math.random() * 24)
      : Math.floor(Math.random() * 25)

    await db.query(
      `INSERT INTO civic_issues (
        id, issue_number, type, category, title, description,
        latitude, longitude, address, ward,
        severity, severity_score, status,
        reported_by, is_demo_data, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,
        NOW() - INTERVAL '${Math.floor(Math.random() * 168)} hours',
        NOW()
      ) ON CONFLICT (issue_number) DO NOTHING`,
      [
        issueId,
        `CIV-${String(1041 + i).padStart(4, '0')}`,
        type,
        'ROAD',
        `${type.replace(/_/g, ' ')} near ${ward}`,
        `A ${type.toLowerCase().replace(/_/g, ' ')} reported in ${ward}. Requires attention.`,
        lat, lng,
        `Main Road, ${ward}`,
        ward,
        severity, severityScore, status,
        citizenId,
      ]
    )
  }

  logger.info('[Seed] ✅ Demo data seeded successfully (SYNTHETIC DATA ONLY)')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => { logger.error('[Seed] Failed:', err); process.exit(1) })
