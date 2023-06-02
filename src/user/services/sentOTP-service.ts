import createAccessToken from "../../middleware/create-access-token";
import UserModel from "../../models/user-model";
import UserVerificationModel from "../../models/userVerification-model";
import { nodeMailFunc } from "../../utils/node-mailer";

export const sendOTPService = async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (user.active) {
        throw new Error('User already verified');
    } else {
    const otp = `${Math.floor(1000+Math.random()*9000)}`
    const JWT_TOKEN = createAccessToken(email);
    await UserVerificationModel.create({
        email,
        userId: user._id,    
        otp,
        createdAt: Date.now(),
        expiresAt: Date.now()+300000
    })
    const subject = 'OTP for password reset';
    const text = `Your OTP for password reset is ${otp}`;
    nodeMailFunc(email, subject, text);
    return { message: 'OTP sent successfully', token: JWT_TOKEN }
    }
    
}