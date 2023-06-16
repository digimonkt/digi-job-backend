import UserModel from "../../models/user-model";
import JobSeekerProfileModel from "../../models/jobSeekerProfile-model";
import EmployerProfileModel from "../../models/employerProfile-model";
import mediaModel from "../../models/media-model";

export const getUserDetailService = async (userId: string) => {
  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },

      {
        $lookup: {
          from: JobSeekerProfileModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "jobSeekerProfile",
        },
      },
      {
        $lookup: {
          from: EmployerProfileModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "employerProfile",
        },
      },
      {
        $lookup: {
          from: "Education",
          localField: "_id",
          foreignField: "user",
          as: "education_record",
        },
      },
      {
        $lookup: {
          from: "WorkExperience",
          localField: "_id",
          foreignField: "user",
          as: "work_experience",
        },
      },
      {
        $lookup: {
          from: "Resume",
          localField: "_id",
          foreignField: "user",
          as: "resume",
        },
      },
      {
        $lookup: {
          from: "Languages",
          localField: "_id",
          foreignField: "user",
          as: "languages",
        },
      },
      {
        $lookup: {
          from: "Skills",
          localField: "_id",
          foreignField: "user",
          as: "skills",
        },
      },
      {
        $addFields: {
          profile: {
            $cond: {
              if: { $gt: [{ $size: "$jobSeekerProfile" }, 0] },
              then: { $arrayElemAt: ["$jobSeekerProfile", 0] },
              else: { $arrayElemAt: ["$employerProfile", 0] },
            },
          },
        },
      },
      {
        $project: {
          jobSeekerProfile: 0,
          employerProfile: 0,
        },
      },
    ]);
    if (user.length > 0) {
      const userData = user[0];
      const userDetails = {
        code: 200,
        data: {
          id: userData._id,
          email: userData.email,
          mobile_number: userData.mobile_number,
          country_code: userData.country_code,
          name: userData.name,
          image: userData.image,
          role: userData.role || userData.profile_role,
          profile: {},
          education_record: userData.education_record,
          work_experience: userData.work_experience,
          resume: userData.resume,
          languages: userData.languages,
          skills: userData.skills,
        },
      };

      const mediaDetail = await mediaModel.aggregate([
        {
          $match: {
            _id: userData?.profile.licenseMedia,
          },
        },
      ]);
      if (userData.profile) {
        if (userData.profile_role === "job_seeker") {
          const jobSeekerProfile = userData.profile;
          userDetails.data.profile = {
            gender: jobSeekerProfile.gender,
            dob: jobSeekerProfile.dob,
            employment_status: jobSeekerProfile.employment_status,
            description: jobSeekerProfile.description,
            market_information:
              jobSeekerProfile.market_information_notification,
            job_notification: jobSeekerProfile.job_notification,
            license: mediaDetail[0]?.file_path,
          };
          userDetails.data.education_record = jobSeekerProfile.education_record;
          userDetails.data.work_experience = jobSeekerProfile.work_experience;
          userDetails.data.languages = jobSeekerProfile.languages;
          userDetails.data.skills = jobSeekerProfile.skills;
        } else if (userData.profile_role === "employer") {
          const employerProfile = userData.profile;
          userDetails.data.profile = {
            organization_name: employerProfile.organization_name,
            description: employerProfile.description,
            organization_type: employerProfile.organization_type,
            license_id: employerProfile.license_id,
            license_id_file: employerProfile.license_id_file,
            license: mediaDetail[0]?.file_path,
          };
        }
      }

      return userDetails;
    }
  } catch (error) {
    console.log({ error });
    return error;
  }
};
