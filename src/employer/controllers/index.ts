import { Response } from "express";

import EmployerProfileModel from "../../models/employerProfile-model";
import JobDetailsModel, { status } from "../../models/jobDetails-model";
import JobAttachmentsItemModel from "../../models/JobAttachmentsItem-model";
import MediaModel from "../../models/media-model";

import { CustomRequest } from "../../interfaces/interfaces";
import {
  aboutMeSchema,
  createJobSchema,
  searchSchema,
} from "../../utils/employer-validators";
import { aboutMeService } from "../service";

const getJobHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { employerId, search, limit, page } = req.query;
    await searchSchema.validateAsync({ employerId, search, limit, page });

    let query = {};

    if (employerId) {
      query = { employerId: employerId };
    }

    if (search) {
      query = {
        ...query,
        title: { $regex: search, $options: "i" },
      };
    }

    let jobs = JobDetailsModel.find(query);

    if (limit && page) {
      const startIndex = (page - 1) * limit;
      jobs = jobs.skip(startIndex).limit(limit);
    }

    const filteredJobs = await jobs.exec();

    res.status(200).json({ data: filteredJobs });
  } catch (error) {
    console.error("Error while fetching jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobAnalysisHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // Perform job analysis query to get the count of jobs per month
    const jobAnalysis = await JobDetailsModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      code: 200,
      data: {
        order_counts: jobAnalysis,
      },
    });
  } catch (error) {
    console.error("Error while fetching job analysis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createJobHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    await createJobSchema.validateAsync(req.body);
    const file_path = req.files.filename;
    const media_type = req.files.mimetype;
    console.log({ hello: req.files });
    const media = await MediaModel.create({
      file_path,
      media_type,
    });
    const newJob = new JobDetailsModel({
      ...req.body,
    });

    await JobAttachmentsItemModel.create({
      job: newJob._id,
      attachment: media._id,
    });
    // Save the new job to the database
    await newJob.save();

    res.json({ code: 200, data: { message: "Job Added successfully" } });
  } catch (error) {
    console.error("Error while creating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateJobHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const jobId = req.params.jobId;
    const {
      title,
      budget_currency,
      budget_amount,
      budget_pay_period,
      description,
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
      attachments,
      attachments_remove,
    } = req.body;
    await createJobSchema.validateAsync(req.body);
    // Find the job in the database and update its fields
    const job = await JobDetailsModel.findByIdAndUpdate(
      jobId,
      {
        title,
        budget_currency,
        budget_amount,
        budget_pay_period,
        description,
        job_category,
        is_full_time,
        is_part_time,
        has_contract,
        contact_email,
        contact_phone,
        contact_whatsapp,
        highest_education,
        $pull: {
          language: { $in: language_remove || [] },
          attachments: { $in: attachments_remove || [] },
        },
        $push: {
          language: { $each: language || [] },
          attachments: { $each: attachments || [] },
        },
        skill,
        experience,
        deadline,
        start_date,
      },
      { new: true }
    );

    if (!job) {
      res.status(404).json({ error: "Job not found" });
    }

    res.json({ code: 200, data: { message: "Updated Successfully" } });
  } catch (error) {
    console.error("Error while updating job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateJobStatusHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await JobDetailsModel.findById(jobId);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    // Toggle the status of the job
    job.status = job.status === status.Active ? status.Active : status.Inactive;

    // Save the updated job to the database
    await job.save();

    const message =
      job.status === status.Active
        ? "This job is active"
        : "This job is placed on hold";

    res.json({ code: 200, data: { message } });
  } catch (error) {
    console.error("Error while updating job status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const aboutMeHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const employerId = req.user._id; // Assuming you have the user ID available

    const {
      organization_name,
      organization_type,
      mobile_number,
      country_code,
      market_information_notification,
      other_notification,
      license_id,
    } = req.body;

    await aboutMeSchema.validateAsync(req.body);
    const results = await aboutMeService(
      employerId,
      organization_name,
      organization_type,
      mobile_number,
      country_code,
      market_information_notification,
      other_notification,
      license_id,
      req
    );
    if (!results) {
      res.status(404).json({ error: "EmployerProfileModel not found" });
      return;
    }
    res.json({ code: 200, data: { message: "Updated Successfully" } });
  } catch (error) {
    console.error("Error while updating employer about:", error);
    res.status(400).json({ body: { message: error.message } });
  }
};

export {
  getJobHandler,
  getJobAnalysisHandler,
  createJobHandler,
  updateJobHandler,
  updateJobStatusHandler,
  aboutMeHandler,
};
