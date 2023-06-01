import { Response } from 'express';
import { CustomRequest } from '../../interfaces/interfaces';

import SavedJobModel from '../../models/savedJob-model';
import AppliedJobModel from '../../models/appliedJob-model';
import JobDetailsModel from '../../models/jobDetails-model';
import UserSessionModel, { IUserSessionDocument } from '../../models/userSession-model';
import UserModel from '../../models/user-model';
import JobSeekerProfileModel from '../../models/jobSeekerProfile-model';
import EducationRecordModel from '../../models/educationRecord-model';
import JobSeekerLanguageModel from '../../models/jobSeekerLanguageProficiency-model';


import { IeducationRecord } from '../../models/educationRecord-model';
import { IjobSeekerLanguageProficiency } from '../../models/jobSeekerLanguageProficiency-model';
import JobSeekerSkillModel from '../../models/jobSeekerSkill-model';
import { IJobSeekerSkill } from '../../models/jobSeekerSkill-model';

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
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
    const userId = IUserSessionDocument.user.toString()

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
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')

    const { title, start_date, end_date, institute, organization, description, } = req.body;

    const newEducation: IeducationRecord = {
      title,
      start_date,
      end_date,
      institute,
      organization,
      description,
      user: IUserSessionDocument.user,
    };

    // Save the new education to the database
    const newEducationObject =  await EducationRecordModel.create(newEducation);

    res.status(201).json(newEducationObject);
  } catch (error) {
    console.error('Error while adding education:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEducationHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract the education ID from the request parameters
    
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
    
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
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')

    EducationRecordModel.findByIdAndDelete(educationId);
    res.status(200).json({ message: 'Deleted Successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
  
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
    await JobSeekerLanguageModel.findByIdAndUpdate(languageId, updatedFields);

    res.status(200).json({ message: 'Updated Successfully' });
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteLanguageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
    
    const { languageId } = req.params;

    // Delete the language record using findByIdAndDelete
    await JobSeekerLanguageModel.findByIdAndDelete(languageId);

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
    const sessionId = req.user._id; 
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')

    // Remove skills
    if (skill_remove && skill_remove.length > 0) {
      await JobSeekerSkillModel.deleteMany({ _id: { $in: skill_remove }, user: IUserSessionDocument.user });
    }

    // Add skills
    if (skill_add && skill_add.length > 0) {
      const newSkills: IJobSeekerSkill[] = skill_add.map((skill: string) => ({
        skill,
        user: IUserSessionDocument.user,
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
  
};

const getAppliedJobsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  
};


const saveJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  
};

const getSavedJobsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  
};

const deleteSavedJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  
};

export {
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
  getAppliedJobsHandler,
  applyJobHandler,
  saveJobHandler,
  getSavedJobsHandler,
  deleteSavedJobHandler,
}