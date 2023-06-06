import mongoose, {Document, Schema} from "mongoose";
import slugify from "slugify";

export interface Iskill {
    title: string
    slug: string
    active: boolean
    deleted: boolean
}

export interface IskillDocument extends Iskill, Document {
    createdAt: Date
    updatedAt: Date
}

const skillSchema: Schema = new Schema({
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

skillSchema.pre('validate', async function (this: IskillDocument, next: ()=> void ) {
    if (!this.slug){
        this.slug = slugify(this.title, {lower: true});
    }
    console.log('slugify ran', this.title);
    next();
});

export default mongoose.model<Iskill>('Skill', skillSchema);