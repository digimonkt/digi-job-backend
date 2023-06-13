import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";
import IjobCategory from "./jobCategory-model";

export interface JsubCategory {
    categoryId: mongoose.Schema.Types.ObjectId
    title: string
    slug: string
    active: boolean
}

export interface JsubCategoryDocument extends JsubCategory, Document {
    createdAt: Date
    updatedAt: Date
}

const jobSubCategorySchema: Schema = new Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: "jobCategory", require: true
    },
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
}, { timestamps: true });

jobSubCategorySchema.pre('validate', async function (this: JsubCategoryDocument, next: () => void) {
    if (!this.slug) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

export default mongoose.model<JsubCategory>('jobSubCategory', jobSubCategorySchema);