import mongoose, {Document, Schema} from "mongoose";

export interface Ieducation_level {
    title: string
    slug: string
    active: boolean
    deleted: boolean
}

export interface Ieducation_levelDocument extends Ieducation_level, Document {
    createdAt: Date
    updatedAt: Date
}

const education_levelSchema: Schema = new Schema({
    title: {
        type: String, required: true  
    },
    slug: {
        type: String, required: true, unique: true
    },
    active: {
        type: Boolean
    },
    deleted: {
        type: Boolean
    }
}, {timestamps: true});

export default mongoose.model<Ieducation_level>('EducationLevel', education_levelSchema);