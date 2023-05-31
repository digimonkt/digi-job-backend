import mongoose, { Document, Schema } from "mongoose";

export interface IjobSeekerLanguageProficiency {
    language: string
    written: written
    spoken: spoken
    user: mongoose.Schema.Types.ObjectId
}

enum written {
    basic='basic',
    conversational='conversational',
    fluent='fluent',
}

enum spoken {
    basic='basic',
    conversational='conversational',
    fluent='fluent',
}

export interface Ijob_seeker_document extends IjobSeekerLanguageProficiency, Document {
    createdAt: Date
    updatedAt: Date
}


const UserSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    gender: { 
        type: String, required: false, unique: true 
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


export default mongoose.model<Ijob_seeker_document>('JobSeekerLanguage', UserSchema);