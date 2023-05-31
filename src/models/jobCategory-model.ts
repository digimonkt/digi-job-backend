import mongoose, { Document, Schema } from "mongoose";

export interface IjobCategory {
    title: string
    slug: string
    active: boolean
}

export interface IjobCategoryDocument extends IjobCategory, Document {
    createdAt: Date
    updatedAt: Date
}

const jobCategorySchema: Schema = new Schema({
    title: {
        type: String, required: true
    },
    slug: {
        type: String, required: true, unique: true
    },
    active: {
        type: Boolean, required: false
    }
}, { timestamps: true });

export default mongoose.model<IjobCategoryDocument>('JobCategory', jobCategorySchema);