import { Router } from 'express'
import { getSummary, getTrends, getWardStats } from '../controllers/analyticsController'

const router = Router()

router.get('/summary', getSummary)
router.get('/trends', getTrends)
router.get('/wards', getWardStats)

export default router
