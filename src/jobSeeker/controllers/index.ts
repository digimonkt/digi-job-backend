import { Response } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';

import JobSeekerProfileModel from '../../models/jobSeekerProfile-model';
import EducationRecordModel from '../../models/educationRecord-model';

import { IeducationRecord } from '../../models/educationRecord-model';
import JobSeekerSkillModel from '../../models/jobSeekerSkill-model';
import { Ijobseekerskill } from '../../interfaces/interfaces';
import SavedJobModel from '../../models/savedJob-model';
import AppliedJobModel from '../../models/appliedJob-model';
import jobSeekerLanguageProficiencyModel from '../../models/JobSeekerLanguageProficiency-model';

const aboutMeHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract the data from the request body
    const {
      gender,
      dob,
      employment_status,
      description,
      market_information_notification,
      job_notification,
      highest_education,
    } = req.body;
    const userId = req.user._id.toString()

    JobSeekerProfileModel.findByIdAndUpdate(userId
      , {
        gender,
        dob,
        employment_status,
        description,
        market_information_notification,
        job_notification,
        highest_education,
      }, { new: true });

    res.status(200).json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addEducationHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract the data from the request body

    const userId = req.user._id

    const { title, start_date, end_date, institute, organization, description, } = req.body;

    const newEducation: IeducationRecord = {
      title,
      start_date,
      end_date,
      institute,
      organization,
      description,
      user: userId,
    };

    // Save the new education to the database
    const newEducationObject = await EducationRecordModel.create(newEducation);

    res.status(201).json(newEducationObject);
  } catch (error) {
    console.error('Error while adding education:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEducationHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract the education ID from the request parameters

    const { educationId } = req.params;
    const { title, start_date, end_date, institute, organization, description, } = req.body;

    EducationRecordModel.findByIdAndUpdate(educationId, {
      title,
      start_date,
      end_date,
      institute,
      organization,
      description,
    }, { new: true });

    res.status(200).json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteEducationHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract the education ID from the request parameters
    const { educationId } = req.params;
    EducationRecordModel.findByIdAndDelete(educationId);
    res.status(200).json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { languageId } = req.params;
    const { written, spoken } = req.body;

    const updatedFields: { written?: string, spoken?: string } = {};
    if (written) {
      updatedFields.written = written;
    }
    if (spoken) {
      updatedFields.spoken = spoken;
    }

    // Update the language record using findByIdAndUpdate
    await jobSeekerLanguageProficiencyModel.findByIdAndUpdate(languageId, updatedFields);

    res.status(200).json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { languageId } = req.params;

    // Delete the language record using findByIdAndDelete
    await jobSeekerLanguageProficiencyModel.findByIdAndDelete(languageId);

    res.status(200).json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting language:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const addWorkExperienceHandler = async (req: CustomRequest, res: Response): Promise<void> => {

// };


// const updateWorkExperienceHandler = async (req: CustomRequest, res: Response): Promise<void> => {

// };

// const deleteWorkExperienceHandler = async (req: CustomRequest, res: Response): Promise<void> => {

// };

const addSkillHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { skill_remove, skill_add } = req.body;
    const userId = req.user._id.toString()

    // Remove skills
    if (skill_remove && skill_remove.length > 0) {
      await JobSeekerSkillModel.deleteMany({ _id: { $in: skill_remove }, user: userId });
    }

    // Add skills
    if (skill_add && skill_add.length > 0) {
      const newSkills: Ijobseekerskill[] = skill_add.map((skill: string) => ({
        skill,
        user: userId,
      }));

      await JobSeekerSkillModel.create(newSkills);
    }

    res.status(200).json({ message: 'Skills added.' });
  } catch (error) {
    console.error('Error while adding skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const applyJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { shortLetter, attachment } = req.body;
    const sessionId = req.user._id;

    // Perform necessary validations and checks before applying for the job

    // Save the application details to the database or perform any other necessary actions
    const appliedJob = await AppliedJobModel.create({
      user: sessionId,
      job: jobId,
      shortLetter,
      attachment,
    });

    res.status(200).json({ data: { message: 'Applied Successfully' } });
  } catch (error) {
    console.error('Error while applying for the job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAppliedJobsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { order_by, search_by, page, limit } = req.query;
    const sessionId = req.user._id;

    // Construct the query parameters based on the request
    const query = {
      user: sessionId,
    };

    // Set the sorting order
    const sort = order_by === 'ascending' ? 1 : -1;

    // Set the sorting field
    let sortBy;
    if (search_by === 'expiration') {
      sortBy = 'expiration';
    } else if (search_by === 'salary') {
      sortBy = 'budget_amount';
    }

    // Fetch the applied jobs with pagination and sorting
    const appliedJobs = await AppliedJobModel.find(query)
      .sort({ [sortBy]: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    // Count the total number of applied jobs
    const total = await AppliedJobModel.countDocuments(query);

    res.status(200).json({
      data: {
        appliedJobs,
        total,
        current_page: parseInt(page),
        current_limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error while retrieving applied jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const saveJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const sessionId = req.user._id;

    // Check if the job is already saved by the user
    const existingSavedJob = await SavedJobModel.findOne({ job: jobId, user: sessionId });

    if (existingSavedJob) {
      // The job is already saved by the user
      res.status(200).json({ message: 'Job already saved' });
    } else {
      // Save the job for the user
      const newSavedJob = new SavedJobModel({ job: jobId, user: sessionId });
      await newSavedJob.save();

      res.status(200).json({ message: 'Saved Successfully' });
    }
  } catch (error) {
    console.error('Error while saving a job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handler for getting saved jobs
const getSavedJobsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const savedJobs = await SavedJobModel.find({ user: req.user._id })
      .populate('job')
      .skip(skip)
      .limit(limit);

    // Get the total count of saved jobs for the user
    const totalSavedJobs = await SavedJobModel.countDocuments({ user: req.user._id });

    res.status(200).json({
      data: {
        savedJobs,
        total: totalSavedJobs,
        current_page: page,
        current_limit: limit,
      },
    });
  } catch (error) {
    console.error('Error while retrieving saved jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handler for deleting a saved job
const deleteSavedJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    await SavedJobModel.findByIdAndDelete(jobId);

    res.status(200).json({ message: 'Job Unsaved' });
  } catch (error) {
    console.error('Error while unsaving the job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
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
}