import upload from '../../middleware/multer';
import express from 'express'
import {
  aboutMeHandler,
  addEducationHandler,
  updateEducationHandler,
  deleteEducationHandler,
  // addWorkExperienceHandler,
  // updateWorkExperienceHandler,
  // deleteWorkExperienceHandler,
  // addLanguageHandler,
  updateLanguageHandler,
  deleteLanguageHandler,
  addSkillHandler,
  // getAppliedJobsHandler,
  // applyJobHandler,
  // saveJobHandler,
  // getSavedJobsHandler,
  // deleteSavedJobHandler,
} from '../controllers/index';

const router = express.Router();

// Profile routes
router.patch('/about-me', aboutMeHandler);

// Education routes
router.post('/educations', addEducationHandler);
router.patch('/educations/:educationId', updateEducationHandler);
router.delete('/educations/:educationId', deleteEducationHandler);

// Experience routes
// router.post('/work-experiences', addWorkExperienceHandler);
// router.patch('/work-experiences/:workExperienceId', updateWorkExperienceHandler);
// router.delete('/work-Experience/:workExperienceId', deleteWorkExperienceHandler);

// // Language routes
// router.post('/language', addLanguageHandler);
router.patch('/languages/:languageId', updateLanguageHandler);
router.delete('/languages/:languageId', deleteLanguageHandler);

// Skill routes
router.post('/skills', addSkillHandler);

// Job application routes
// router.get('/jobs/apply', getAppliedJobsHandler);
// router.post('/jobs/apply/:jobId', applyJobHandler);

// // Saved jobs routes
// router.post('/jobs/save/:jobId', saveJobHandler);
// router.get('/jobs/save', getSavedJobsHandler);
// router.delete('/jobs/save/:jobId', deleteSavedJobHandler);



export default router;
