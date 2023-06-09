import { Router } from "express";

import { postVerify } from "../../middleware/post-verify";
import {
  createEducationLevelHandler,
  createJobCategoryHandler,
  createLanguageHandler,
  createSkill,
  deleteEducationLevelHandler,
  deleteJobCategoryHandler,
  deleteLanguageHandler,
  deleteSkillHandler,
  getEducationLevelHandler,
  getJobCategoryHandler,
  getLanguageHandler,
  getSkillHandler,
  createSubJobCategoryHandler,
  getJobSubCategory,
  getAllCountryHandler,
  getAllCityHandler,
} from "../controllers";

const router = Router();

router.post("/language", postVerify, createLanguageHandler);
router.get("/language", postVerify, getLanguageHandler);
router.delete("/language/:languageId", postVerify, deleteLanguageHandler);

router.post("/skills", postVerify, createSkill);
router.get("/skills", postVerify, getSkillHandler);
router.delete("/skills/:skillId", postVerify, deleteSkillHandler);

router.post("/education-level", postVerify, createEducationLevelHandler);
router.get("/education-level", postVerify, getEducationLevelHandler);
router.delete(
  "/education-level/:educationLevelId",
  postVerify,
  deleteEducationLevelHandler
);

router.post("/job-category", postVerify, createJobCategoryHandler);
router.get("/job-category", postVerify, getJobCategoryHandler);
router.delete(
  "/job-category/:jobCategoryId",
  postVerify,
  deleteJobCategoryHandler
);

router.post("/job-sub-category", postVerify, createSubJobCategoryHandler);
router.get("/job-sub-category", postVerify, getJobSubCategory);

router.get("/country", getAllCountryHandler);
router.get("/city", getAllCityHandler);


export default router;
