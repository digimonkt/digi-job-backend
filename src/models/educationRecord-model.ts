import mongoose, { Document, Schema } from "mongoose";

export interface IeducationRecord {
    title: string
    start_date: Date
    end_date: Date
    institude: string
    organization: string
    description: string
    user: mongoose.Schema.Types.ObjectId
}

export interface IeducationRecordDocument extends IeducationRecord, Document {
    createdAt: Date
    updatedAt: Date
}

const educationRecordSchema: Schema = new Schema({
    title: {
        type: String, required: true
    },
    start_date: {
        type: Date, required: true
    },
    end_date: {
        type: Date, required: false
    },
    institude: {
        type: String, required: true
    },
    organization: {
        type: String, required: true
    },
    description: {
        type: String, required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }
}, { timestamps: true });

export default mongoose.model<IeducationRecordDocument>('EducationRecord', educationRecordSchema);