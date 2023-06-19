import { CustomRequest } from "../../interfaces/interfaces";
import employerProfileModel from "../../models/employerProfile-model";
import MediaModel from "../../models/media-model";
import { ObjectId } from "../../utils/constant";

export const aboutMeService = async (body, req) => {
  try {
    const media = await MediaModel.create({
      file_path: req.file.path,
      media_type: req.file.mimetype,
    });
    // Find the employer in the database and update the about section
    const employer = await employerProfileModel.findOneAndUpdate(
      { user: req.user._id },
      {
        ...body,
        // license_id_file: media._id, // Assuming the license file is stored in req.file.buffer
        licenseMedia: media._id,
      },
      { new: true }
    );
    return employer;
  } catch (error) {
    console.error("Error while updating employer about:", error);
    throw new Error(error);
  }
};
