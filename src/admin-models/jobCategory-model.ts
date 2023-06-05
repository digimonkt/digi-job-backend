import mongoose, {Document, Schema} from "mongoose";
import slugify from "slugify";

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
        type: Boolean,
        default: true
    },
}, {timestamps: true});

jobCategorySchema.pre('validate', async function (this: IjobCategoryDocument, next: ()=> void ) {
    if (!this.slug){
        this.slug = slugify(this.title, {lower: true});
    }
    next();
});

export default mongoose.model<IjobCategory>('jobCategory', jobCategorySchema);