import mongoose, { Document, Schema } from "mongoose";

export interface Iemployer {
    user: mongoose.Schema.Types.ObjectId
    description: string
    organization_type: organization_type
    market_information_notification: boolean
    other_notification: boolean
    license_id: string
    license_id_file: mongoose.Schema.Types.ObjectId,
    attachement: mongoose.Types.ObjectId[]
}

enum organization_type {
    Government = 'Government',
    NGO = 'NGO',
    Buisness = 'Buisness',
}


export interface IemployerDocument extends Iemployer, Document {
    createdAt: Date
    updatedAt: Date
}

const employerSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    description: {
        type: String, required: false
    },
    organization_type: {
        type: String, required: false
    },
    market_information_notification: {
        type: Boolean, required: false, default: false

    },
    other_notification: {
        type: Boolean, required: false, default: false
    },
    license_id: {
        type: String, required: false
    },
    license_id_file: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: false
    },
    attachement: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Media",
                required: true,
            },
        ],
    },
}, { timestamps: true });

export default mongoose.model<IemployerDocument>('Employer', employerSchema);