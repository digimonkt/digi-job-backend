import mongoose, {Document, Schema} from "mongoose";
import slugify from "slugify";

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
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

education_levelSchema.pre('validate', async function (this: Ieducation_levelDocument, next: ()=> void ) {
    if (!this.slug){
        this.slug = slugify(this.title, {lower: true});
    }
    next();
});

export default mongoose.model<Ieducation_level>('EducationLevel', education_levelSchema);