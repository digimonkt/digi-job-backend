import { Router } from 'express'
import { getJobHandler, createJobHandler, updateJobHandler, updateJobStatusHandler, getJobAnalysisHandler, aboutMeHandler } from '../controllers/index'

import upload from '../../middleware/multer';
import { postVerify } from '../../middleware/post-verify';

const router = Router();

router.get('/job', postVerify,getJobHandler)
router.get('/job-analysis', postVerify,getJobAnalysisHandler)
router.post('/job', postVerify ,upload, createJobHandler) 
router.put('jobs/:jobId', postVerify ,updateJobHandler)
router.put('/jobs/:jobId/status', postVerify, updateJobStatusHandler)
router.patch('/about-me', postVerify, aboutMeHandler)

export default router