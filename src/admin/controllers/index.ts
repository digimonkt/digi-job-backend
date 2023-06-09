import { Response } from "express";
import {
  Ieducation_levelDocument,
} from "../../admin-models/educationLevel-model";
import education_levelSchema from "../../admin-models/educationLevel-model";
import languageModel from "../../admin-models/language-model-copy";

import { CustomRequest } from "../../interfaces/interfaces";
import skillModel, { IskillDocument } from "../../admin-models/skill-model";
import jobCategoryModel, {
  IjobCategoryDocument,
} from "../../admin-models/jobCategory-model";
import {
  createSchema,
  deleteSchema,
  getSchema,
} from "../../utils/admin-validators";
import CountryModel from "../../models/country";
import CityModel from "../../models/cities";
import jobSubCategoryModels, { JsubCategoryDocument } from "../../admin-models/jobSubCategory-models";
import mongoose from "mongoose";

const createLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    await createSchema.validateAsync({ title });
    const language = await languageModel.create({ title });
    res.status(201).json({
      data: {
        id: language._id,
        title: language.title,
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { search, page, limit } = req.query as { search: string, page: string, limit: string }
    getSchema.validateAsync({ search, page, limit })
    let language: Ieducation_levelDocument[] | null
    if (search) {
      language = await languageModel.find({ title: { $regex: search, $options: 'i' } })
    } else {
      language = await languageModel.find()
    }

    const result = {
      count: language?.length,
      results: language.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    }
    res.status(200).json({
      ...result
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const deleteLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { languageId } = req.params as { languageId: string }
    deleteSchema.validateAsync({ languageId })
    await languageModel.findByIdAndUpdate(languageId, { active: false });
    res.status(200).json({
      message: 'Deleted successfully'
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const createSkill = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body as { title: string }
    await createSchema.validateAsync({ title })
    const skill = await skillModel.create({ title })

    res.status(201).json({
      data: {
        id: skill._id,
        title: skill.title
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getSkillHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { search, page, limit } = req.query as { search: string, page: string, limit: string }
    getSchema.validateAsync({ search, page, limit })
    let skill: IskillDocument[] | null
    if (search) {
      skill = await skillModel.find({ title: { $regex: search, $options: 'i' } })
    } else {
      skill = await skillModel.find()
    }
    console.log(skill)
    const result = {
      count: skill?.length,
      results: skill?.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    }
    console.log(result)
    res.status(200).json({
      ...result
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}



const deleteSkillHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { skillId } = req.params as { skillId: string }
    deleteSchema.validateAsync({ skillId })
    await skillModel.findByIdAndUpdate(skillId, { active: false });
    res.status(200).json({
      message: 'Deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const createEducationLevelHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    await createSchema.validateAsync({ title });
    const educationLevel = await education_levelSchema.create({ title });
    res.status(201).json({
      data: {
        id: educationLevel._id,
        title: educationLevel.title,
      }
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getEducationLevelHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { search, page, limit } = req.query as { search: string, page: string, limit: string }
    getSchema.validateAsync({ search, page, limit })
    let educationLevel: Ieducation_levelDocument[] | null
    if (search) {
      educationLevel = await education_levelSchema.find({
        title: { $regex: search, $options: "i" },
      });
    } else {
      educationLevel = await education_levelSchema.find();
    }
    const result = {
      count: educationLevel?.length,
      results: educationLevel.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    }
    res.status(200).json({
      ...result
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const deleteEducationLevelHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { educationLevelId } = req.query as { educationLevelId: string };
    deleteSchema.validateAsync({ educationLevelId })
    await languageModel.findByIdAndUpdate(educationLevelId, { active: false });
    res.status(200).json({
      message: 'Deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const createJobCategoryHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body as { title: string };
    await createSchema.validateAsync({ title })
    const jobCategory = await jobCategoryModel.create({ title });

    res.status(201).json({
      data: {
        id: jobCategory._id,
        title: jobCategory.title
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

const getJobCategoryHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { search, page, limit } = req.query as { search: string, page: string, limit: string }
    getSchema.validateAsync({ search, page, limit })
    let jobCategory: IjobCategoryDocument[] | null
    if (search) {
      jobCategory = await jobCategoryModel.find({ title: { $regex: search, $options: 'i' } })
    } else {
      jobCategory = await jobCategoryModel.find()
    }
    const result = {
      count: jobCategory?.length,
      results: jobCategory.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    }
    res.status(200).json({
      ...result
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}



const deleteJobCategoryHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { jobCategoryId } = req.body as { jobCategoryId: string[] };
    await jobCategoryModel.updateMany({ _id: { $in: jobCategoryId } }, { active: false });

    res.status(200).json({
      message: 'Jobs updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createSubJobCategoryHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { title, jobCategoryId } = req.body as { title: string, jobCategoryId: string };
    let Objectid = new mongoose.Types.ObjectId(jobCategoryId)
    const jobSubCategory = await jobSubCategoryModels.create({ title, categoryId: Objectid });
    res.status(201).json({
      jobSubCategory
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

const getJobSubCategory = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.query as { categoryId: string }
    let jobSubCategory: JsubCategoryDocument[] | null
    jobSubCategory = await jobSubCategoryModels.find({ categoryId })
    const result = {
      count: jobSubCategory?.length,
      results: jobSubCategory.map((item) => ({
        id: item._id,
        title: item.title,
      })),
    }
    res.status(200).json({
      ...result
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getAllCountryHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    let limit = parseInt(req.query.limit as string, 10);
    if (!limit || isNaN(limit)) {
      limit = 100; // Set default limit to 100 if no or invalid limit is provided
    }
    const results = await CountryModel.find().limit(limit);
    res.status(200).json({
      message: "Countries retrieved successfully",
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllCityHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const results = await CityModel.find({
      country_id: req.query.countryId,
    });
    res.status(200).json({
      message: "Countries retrieved successfully",
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export {
  createLanguageHandler,
  getLanguageHandler,
  deleteLanguageHandler,
  createSkill,
  deleteSkillHandler,
  getSkillHandler,
  createEducationLevelHandler,
  getEducationLevelHandler,
  deleteEducationLevelHandler,
  createJobCategoryHandler,
  deleteJobCategoryHandler,
  getJobCategoryHandler,
  createSubJobCategoryHandler,
  getJobSubCategory,
  getAllCountryHandler,
  getAllCityHandler,
};
