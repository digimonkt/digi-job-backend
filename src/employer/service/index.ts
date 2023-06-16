import { CustomRequest } from "../../interfaces/interfaces";
import employerProfileModel from "../../models/employerProfile-model";
import MediaModel from "../../models/media-model";
import { ObjectId } from "../../utils/constant";

export const aboutMeService = async (body, req) => {
    try {
        // const file_path = req.files.filename;
        // const media_type = req.files.mimetype;

        // const media = await MediaModel.create({
        //     file_path,
        //     media_type,
        // });
        const mediaId = [];
        for (let i = 0; i < req.file.length; i++) {
            const element = req.file[i];
            const media = await MediaModel.create({
                file_path: element.path,
                media_type: element.mimetype,
            });
            mediaId.push(new ObjectId(media._id));
        }


        // Find the employer in the database and update the about section
        const employer = await employerProfileModel.findOneAndUpdate(
            { user: req.user._id },
            {
                ...body,
                // license_id_file: media._id, // Assuming the license file is stored in req.file.buffer
                licenseMedia: [...mediaId],
            },
            { new: true }
        );
        return employer;
    }
    catch (error) {
        console.error('Error while updating employer about:', error);
        throw new Error(error);
    }
}