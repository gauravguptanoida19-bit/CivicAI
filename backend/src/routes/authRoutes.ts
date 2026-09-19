import { Router } from 'express'
import { login, register, logout, refresh, getMe } from '../controllers/authController'
import { authenticateJWT } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/login', authLimiter, login)
router.post('/register', authLimiter, register)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.get('/me', authenticateJWT, getMe)

export default router
