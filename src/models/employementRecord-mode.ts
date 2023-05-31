import mongoose, { Document, Schema } from "mongoose";

export interface IemploymentRecord {
    title: string
    start_date: Date
    end_date: Date
    present: boolean
    organization: string
    description: string
    user: mongoose.Schema.Types.ObjectId
}

export interface IemploymentRecordDocument extends IemploymentRecord, Document {
    createdAt: Date
    updatedAt: Date
}

const employementRecordSchema: Schema = new Schema({
    title: {
        type: String, required: true
    },
    start_date: {
        type: Date, required: true
    },
    end_date: {
        type: Boolean
    },
    present: {
        type: String, required: false
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

export default mongoose.model<IemploymentRecordDocument>('EmployementRecord', employementRecordSchema);