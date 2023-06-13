import mongoose, {Document, Schema} from "mongoose";
import slugify from "slugify";

export interface Ilanguage {
    title: string
    slug: string
    active: boolean
    deleted: boolean
}

export interface IlanguageDocument extends Ilanguage, Document {
    createdAt: Date
    updatedAt: Date
}

const languageSchema: Schema = new Schema({
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

languageSchema.pre('validate', async function (this: IlanguageDocument, next: ()=> void ) {
    if (!this.slug){
        this.slug = slugify(this.title, {lower: true});
    }
    next();
});

export default mongoose.model<IlanguageDocument>('Language', languageSchema);