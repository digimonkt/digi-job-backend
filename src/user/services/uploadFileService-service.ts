import MediaModel from "../../models/media-model"
import UserModel from "../../models/user-model"

export const uploadFileService = async (userId: string, file_path: string, media_type: string) => {
    const media = await MediaModel.create({
        media_type,
        file_path: 'images/' + file_path
    })
    await UserModel.findByIdAndUpdate(userId, { display_image: media._id }, { new: true })
}