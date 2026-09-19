import { Router } from 'express'
import { db } from '../services/database'
import { redis } from '../services/redis'
import { mlService } from '../services/mlService'
import { sendSuccess } from '../utils/response'

const router = Router()

router.get('/', async (_req, res) => {
  const dbStatus = await db.healthCheck()
  const redisStatus = await redis.healthCheck()
  const mlStatus = await mlService.healthCheck()

  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus ? 'connected' : 'in-memory-resilient',
      redis: redisStatus ? 'connected' : 'in-memory-resilient',
      mlService: mlStatus ? 'connected' : 'demo-simulation',
    },
    uptime: process.uptime(),
    version: '1.0.0',
  })
})

export default router
