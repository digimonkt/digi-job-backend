import { Router } from 'express'
import { getJobHandler, createJobHandler, updateJobHandler, updateJobStatusHandler, getJobAnalysisHandler, aboutMeHandler } from '../controllers/index'

import upload from '../../middleware/multer';
// import verifyToken from '../../middleware/verify-token'

const router = Router();

router.get('/job', getJobHandler)
// router.get('/tenders', getTendersHandler)
// router.get('/activity', getActivityHandler)
router.get('/job-analysis', getJobAnalysisHandler)

router.post('/job/', upload, createJobHandler) 
// router.post('/tenders', createTenderHandler)

router.put('jobs/:jobId', updateJobHandler) 
// router.put('tenders/:tenderId', updateTenderHandler)
router.put('/jobs/:jobId/status', updateJobStatusHandler)
// router.put('/tenders/:tendersId/status', updateTenderStatusHandler)

router.patch('/about-me', aboutMeHandler)

export default router