import { CustomRequest } from "../../interfaces/interfaces";
import EmployerProfileModel from "../../models/employerProfile-model";
import MediaModel from "../../models/media-model";

export const aboutMeService = async (employerId: string, organization_name: string, organization_type: string, mobile_number: string, country_code: string, country: string, city: string, description: string, market_information_notification: string, other_notification: string, license_id: string, req: CustomRequest) => {
    try {
        const file_path = req.files.filename;
        const media_type = req.files.mimetype;
        console.log("med", media_type)
        // console.log("req.files", req.files)
        console.log("file_path", file_path)
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
                country,
                city,
                description,
                market_information_notification,
                other_notification,
                license_id,
                license_id_file: media._id, // Assuming the license file is stored in req.file.buffer
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