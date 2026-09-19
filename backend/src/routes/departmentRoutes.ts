import { Router } from 'express'
import { getDepartments, getDepartmentById } from '../controllers/departmentController'

const router = Router()

router.get('/', getDepartments)
router.get('/:id', getDepartmentById)

export default router
