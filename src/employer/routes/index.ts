import { Router } from 'express'
import { getJobHandler, createJobHandler, updateJobHandler, updateJobStatusHandler, getJobAnalysisHandler, aboutMeHandler } from '../controllers/index'

import {
    uploadFile, uploadFiles
} from '../../middleware/multer';
import { postVerify } from '../../middleware/post-verify';

const router = Router();

router.get('/jobs', postVerify, getJobHandler)
router.get('/job-analysis', postVerify, getJobAnalysisHandler)
router.post('/jobs', postVerify, uploadFiles, createJobHandler)
router.put('jobs/:jobId', postVerify, uploadFiles, updateJobHandler)
router.put('/jobs/:jobId/status', postVerify, updateJobStatusHandler)
router.patch('/about-me', postVerify, uploadFile, aboutMeHandler)

export default router