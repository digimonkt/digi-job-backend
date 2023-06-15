import { CustomRequest } from "../../interfaces/interfaces";
import EmployerProfileModel from "../../models/employerProfile-model";
import MediaModel from "../../models/media-model";
import { ObjectId } from "../../utils/constant";

export const aboutMeService = async (employerId: string, organization_name: string, organization_type: string, mobile_number: string, country_code: string, market_information_notification: string, other_notification: string, license_id: string, req: CustomRequest) => {
    try {
        // const file_path = req.files.filename;
        // const media_type = req.files.mimetype;

        // const media = await MediaModel.create({
        //     file_path,
        //     media_type,
        // });
        const mediaId = [];
        for (let i = 0; i < req.files.length; i++) {
            const element = req.files[i];
            const media = await MediaModel.create({
                file_path: element.path,
                media_type: element.mimetype,
            });
            mediaId.push(new ObjectId(media._id));
        }

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