import { Router } from 'express'
import { queryCopilot } from '../controllers/aiController'

const router = Router()

router.post('/query', queryCopilot)

export default router
