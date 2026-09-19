import { Router } from 'express'
import { getUsers, updateUserRole } from '../controllers/userController'
import { authenticateJWT, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', authenticateJWT, requireRole('ADMIN', 'SUPERVISOR'), getUsers)
router.put('/:id/role', authenticateJWT, requireRole('ADMIN'), updateUserRole)

export default router
