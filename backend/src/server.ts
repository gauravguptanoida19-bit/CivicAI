import 'express-async-errors'
import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'

import { config } from './config'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { setupSockets } from './sockets/socketHandler'
import { db } from './services/database'
import { redis } from './services/redis'

import healthRoutes from './routes/healthRoutes'
import authRoutes from './routes/authRoutes'
import issueRoutes from './routes/issueRoutes'
import aiRoutes from './routes/aiRoutes'
import analyticsRoutes from './routes/analyticsRoutes'
import departmentRoutes from './routes/departmentRoutes'
import userRoutes from './routes/userRoutes'

const app = express()
const server = http.createServer(app)

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
})
setupSockets(io)

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: '*', credentials: true }))
app.use(compression())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(morgan('dev'))

// Serve static uploads
app.use('/uploads', express.static(config.uploads.dir))

// API Routes
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/users', userRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Centralized error handler
app.use(errorHandler)

// Server initialization
async function startServer() {
  try {
    // Attempt DB and Redis connections with graceful fallbacks
    try {
      const dbConnected = await db.healthCheck()
      if (dbConnected) {
        logger.info('Connected to PostgreSQL database.')
      } else {
        logger.info('PostgreSQL unavailable — using in-memory resilient storage.')
      }
    } catch {
      logger.info('PostgreSQL connection check skipped — using in-memory resilient storage.')
    }

    try {
      await redis.connect()
    } catch {
      logger.info('Redis connection skipped — caching disabled.')
    }

    server.listen(config.port, config.host, () => {
      logger.info(`=======================================================`)
      logger.info(`  CivicAI Backend Server running on http://${config.host}:${config.port}`)
      logger.info(`  Health Check: http://localhost:${config.port}/api/health`)
      logger.info(`  Mode: ${config.env} | Demo Store: Active`)
      logger.info(`=======================================================`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()

export { app, server }
