import mongoose, { Document, Schema } from "mongoose";

export interface Ijob_seeker {
    user: mongoose.Schema.Types.ObjectId
    gender: gender
    dob: Date
    employment_status: employment_status
    description: string
    highest_education: mongoose.Schema.Types.ObjectId
    market_information_notification: boolean
    job_notification: boolean
}

export interface Ijob_seeker_document extends Ijob_seeker, Document {
    createdAt: Date
    updatedAt: Date
}

enum gender {
    male='male',
    female='female'
}

enum employment_status {
    employed='employed',
    unemployed='unemployed'
}

const JobSeekerSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gender: { 
        type: String, required: false 
    },
    dob: { 
        type: Date
    },
    employment_status: {
        type: String, required: false
    },
    description: {
        type: String, required: false
    },
    highest_education: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Education', required: false
    },
    market_information_notification: {
        type: Boolean, required: false
    },
    job_notification:{
        type: Boolean, required: false
    }
}, { timestamps: true });


export default mongoose.model<Ijob_seeker_document>('JobSeeker', JobSeekerSchema);