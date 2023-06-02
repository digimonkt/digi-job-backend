import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUserVerification {
    email: string;
    userId: string;
    otp: string;
    createdAt: number;
    expiresAt: number;
}

export interface IUserVerificationDocument extends IUserVerification, Document {}


const UserVerificationSchema = new Schema({
    email: String,
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
}, { timestamps: true });

UserVerificationSchema.pre('save', async function (this: IUserVerificationDocument, next: ()=> void) {
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(this.otp, salt);
    this.otp = hashedOTP;
    next();
});

export default mongoose.model<IUserVerificationDocument>("UserVerification", UserVerificationSchema);


