import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
    file_path: string
    media_type: string
}

interface IMediaDocument extends IMedia, Document {
    createdAt: Date
    updatedAt: Date
}

const MediaSchema: Schema = new Schema({
    file_path: {
        type: String, required: true, unique: true
    },
    media_type: {
        type: String, required: true
    }
}, { timestamps: true });


export default mongoose.model<IMediaDocument>('Media', MediaSchema);