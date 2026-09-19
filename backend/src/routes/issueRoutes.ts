import { Router } from 'express'
import {
  getIssues,
  getIssueById,
  createIssue,
  analyzeImage,
  updateIssueStatus,
  assignIssue,
  getNearby,
  getMyIssues,
} from '../controllers/issueController'
import { upload } from '../middleware/upload'

const router = Router()

router.get('/', getIssues)
router.get('/nearby', getNearby)
router.get('/my', getMyIssues)
router.post('/analyze-image', upload.single('image'), analyzeImage)
router.post('/', upload.single('image'), createIssue)
router.get('/:id', getIssueById)
router.put('/:id', updateIssueStatus)
router.post('/:id/assign', assignIssue)

export default router
