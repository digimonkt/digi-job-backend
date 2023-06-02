import { CustomRequest } from "../../interfaces/interfaces";
import createAccessToken from "../../middleware/create-access-token";
import createRefreshToken from "../../middleware/create-refresh-token";
import UserModel from "../../models/user-model";
import userSessionModel from "../../models/userSession-model";
import UserVerificationModel,{IUserVerification} from "../../models/userVerification-model";
import bcrypt from 'bcrypt';

export const OTPVerificationService = async (email: string, otp: string, req: CustomRequest) => {
    const UserRecordFromVerfication = await UserVerificationModel.findOne({email}) as IUserVerification
    console.log(UserRecordFromVerfication);
    const { expiresAt } = UserRecordFromVerfication
    const hashedOTP = UserRecordFromVerfication.otp
    if (Date.now() > expiresAt) {
        await UserVerificationModel.deleteMany({email});
        throw new Error('OTP expired');
    }
    else {
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            throw new Error('Invalid OTP');
        }
        else {
            await UserModel.updateOne({ email }, { active: true }, { new: true });
            await UserVerificationModel.deleteMany({email});
        }
    }
    const user = await UserModel.findOne({ email });
    // create new session
    const session = await userSessionModel.create({
        user: user._id,
        ip_address: req.socket.remoteAddress,
        agent: req.get('User-Agent'),
        active: true
    })
    const JWT_TOKEN_ACCESS = createAccessToken(session._id);
    const JWT_TOKEN_REFRESH = createRefreshToken(session._id);
    return { JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH }
}
