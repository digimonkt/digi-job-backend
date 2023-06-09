
import express from 'express'
import { postVerify } from '../../middleware/post-verify';
import {
  aboutMeHandler,
  addEducationHandler,
  updateEducationHandler,
  deleteEducationHandler,
  updateLanguageHandler,
  deleteLanguageHandler,
  addSkillHandler,
  getAppliedJobsHandler,
  applyJobHandler,
  saveJobHandler,
  getSavedJobsHandler,
  deleteSavedJobHandler,
} from '../controllers/index';
import { uploadFiles } from '../../middleware/multer';

const router = express.Router();

// Profile routes
router.patch('/about-me', postVerify, aboutMeHandler);

// Education routes
router.post('/educations', postVerify, addEducationHandler);
router.patch('/educations/:educationId', postVerify, updateEducationHandler);
router.delete('/educations/:educationId', postVerify, deleteEducationHandler);

// // Experience routes
// router.post('/work-experiences', addWorkExperienceHandler);
// router.patch('/work-experiences/:workExperienceId', updateWorkExperienceHandler);
// router.delete('/work-Experience/:workExperienceId', deleteWorkExperienceHandler);

// // Language routes
// router.post('/language', addLanguageHandler);
router.patch('/languages/:languageId', postVerify, updateLanguageHandler);
router.delete('/languages/:languageId', postVerify, deleteLanguageHandler);

// Skill routes
router.post('/skills', postVerify, addSkillHandler);

router.get('/jobs/apply', postVerify, getAppliedJobsHandler);
router.post('/jobs/apply/:jobId', postVerify, uploadFiles, applyJobHandler);

// Saved jobs routes
router.post('/jobs/save/:jobId', postVerify, saveJobHandler);
router.get('/jobs/save', postVerify, getSavedJobsHandler);
router.delete('/jobs/save/:jobId', postVerify, deleteSavedJobHandler);



export default router;
