import { Response } from 'express';

import EmployerProfileModel from '../../models/employerProfile-model';
import JobDetailsModel, { status }  from '../../models/jobDetails-model';
import JobAttachmentsItemModel from '../../models/JobAttachmentsItem-model';
import MediaModel from '../../models/media-model';
import UserSessionModel, { IUserSessionDocument } from '../../models/userSession-model';

import { CustomRequest } from '../../interfaces/interfaces';

const getJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { employerId, search, limit, page } = req.query

    let query = {};

    if (employerId) {
      query = { employerId: employerId };
    }

    if (search) {
      query = {
        ...query,
        title: { $regex: search, $options: 'i' },
      };
    }

    const totalJobs = await JobDetailsModel.countDocuments(query);

    let jobs = JobDetailsModel.find(query);

    if (limit && page) {
      const startIndex = (page - 1) * limit;
      jobs = jobs.skip(startIndex).limit(limit);
    }

    const filteredJobs = await jobs.exec();

    const response = {
      code: 200,
      data: filteredJobs,
      total: totalJobs,
    };

    res.json(response);
  } catch (error) {
    console.error('Error while fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getJobAnalysisHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Perform job analysis query to get the count of jobs per month
    const jobAnalysis = await JobDetailsModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      code: 200,
      data: {
        order_counts: jobAnalysis
      }
    });
  } catch (error) {
    console.error('Error while fetching job analysis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const createJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      budget_currency,
      budget_amount,
      budget_pay_period,
      description,
      country,
      city,
      address,
      job_category,
      is_full_time,
      is_part_time,
      has_contract,
      contact_email,
      contact_phone,
      contact_whatsapp,
      highest_education,
      language,
      skill,
      duration,
      experience,
      deadline,
      start_date,
    } = req.body;

    const file_path = req.files.filename;
    const media_type = req.files.mimetype;

    const media = await MediaModel.create({
      file_path,
      media_type,
    });

    const newJob = new JobDetailsModel({
      title,
      budget_currency,
      budget_amount,
      budget_pay_period,
      description,
      country,
      city,
      address,
      job_category,
      is_full_time,
      is_part_time,
      has_contract,
      contact_email,
      contact_phone,
      contact_whatsapp,
      highest_education,
      language,
      skill,
      duration,
      experience,
      deadline,
      start_date,
    });

    await JobAttachmentsItemModel.create({
      job: newJob._id,
      attachment: media._id,
    });
    // Save the new job to the database
    await newJob.save();

    res.json({ code: 200, data: { message: 'Job Added successfully' } });
  } catch (error) {
    console.error('Error while creating job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateJobHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const jobId = req.params.jobId;
    const {
      title,
      budget_currency,
      budget_amount,
      budget_pay_period,
      description,
      country,
      city,
      address,
      job_category,
      is_full_time,
      is_part_time,
      has_contract,
      contact_email,
      contact_phone,
      contact_whatsapp,
      highest_education,
      language,
      language_remove,
      skill,
      experience,
      deadline,
      start_date,
    } = req.body;

    // Find the job in the database and update its fields
    const job = await JobDetailsModel.findByIdAndUpdate(
      jobId,
      {
        title,
        budget_currency,
        budget_amount,
        budget_pay_period,
        description,
        country,
        city,
        address,
        job_category,
        is_full_time,
        is_part_time,
        has_contract,
        contact_email,
        contact_phone,
        contact_whatsapp,
        highest_education,
        $pull: { language: { $in: language_remove || [] } },
        $push: { language: { $each: language || [] } },
        skill,
        experience,
        deadline,
        start_date,
      },
      { new: true }
    );

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
    }

    res.json({ code: 200, data: { message: 'Updated Successfully' } });
  } catch (error) {
    console.error('Error while updating job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateJobStatusHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await JobDetailsModel.findById(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
    }

    // Toggle the status of the job
    job.status = job.status === status.Active ? status.Inactive : status.Active;

    // Save the updated job to the database
    await job.save();

    const message = job.status === status.Active ? 'This job is active' : 'This job is placed on hold';

    res.json({ code: 200, data: { message } });
  } catch (error) {
    console.error('Error while updating job status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const aboutMeHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const sessionId = req.user._id; // Assuming you have the user ID available
    const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
    const employerId = IUserSessionDocument.user.toString()

    const {
      organization_name,
      organization_type,
      mobile_number,
      country_code,
      market_information_notification,
      other_notification,
      license_id,
    } = req.body;

    const file_path = req.files.filename;
    const media_type = req.files.mimetype;

    const media = await MediaModel.create({
      file_path,
      media_type,
    });

    // Find the employer in the database and update the about section
    const employer = await EmployerProfileModel.findByIdAndUpdate(
      employerId,
      {
        organization_name,
        organization_type,
        mobile_number,
        country_code,
        market_information_notification,
        other_notification,
        license_id,
        license: media._id, // Assuming the license file is stored in req.file.buffer
      },
      { new: true }
    );

    if (!employer) {
      res.status(404).json({ error: 'EmployerProfileModel not found' });
    }

    res.json({ code: 200, data: { message: 'Updated Successfully' } });
  } catch (error) {
    console.error('Error while updating employer about:', error);
    res.status(400).json({ body: { message: error.message } })
  }
}

export {
    getJobHandler,
    // getTendersHandler,
    // getActivityHandler,
    getJobAnalysisHandler,
    createJobHandler,
    // createTenderHandler,
    updateJobHandler,
    // updateTenderHandler,
    updateJobStatusHandler,
    // updateTenderStatusHandler,
    aboutMeHandler
}
