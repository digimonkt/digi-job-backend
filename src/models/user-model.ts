import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser {
    email: string
    password: string
    display_name: string
    country_code: string
    mobile_number: string
    display_image: mongoose.Schema.Types.ObjectId
    profile_role: profile_role
    active: boolean
    deleted: boolean
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date
    updatedAt: Date
}

enum profile_role {
    job_seeker = 'job_seeker',
    employer = 'employer',
    admin = 'admin'
}

const UserSchema: Schema = new Schema({
    email: {
        type: String, required: false, unique: true
    },
    password: {
        type: String, required: true
    },
    mobile_number: {
        type: String, required: false
    },
    country_code: {
        type: String, required: false
    },
    display_name: {
        type: String, required: false
    },
    display_image: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: false
    },
    profile_role: {
        type: String, required: false
    },
    active: {
        type: Boolean, required: false
    },
    deleted: {
        type: Boolean, required: false
    }
}, { timestamps: true });

UserSchema.pre('save', async function(this: IUserDocument, next: () => void) {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  });
export default mongoose.model<IUserDocument>('User', UserSchema);