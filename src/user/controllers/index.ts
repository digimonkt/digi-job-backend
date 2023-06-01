
import { Response } from 'express';
import { CustomRequest, decodedToken } from '../../interfaces/interfaces';
import UserModel from '../../models/user-model';
import UserSessionModel, { IUserSessionDocument } from '../../models/userSession-model';
import JobSeekerModel from '../../models/jobSeekerProfile-model';
import EmployerModel from '../../models/employerProfile-model';
import { IUserDocument } from '../../models/user-model';


import { nodeMailFunc } from '../../utils/node-mailer'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import createToken from '../../middleware/create-refresh-token';
import { getUserDetailService } from '../services/getUsersDetail-service';
import { uploadFileService } from '../services/uploadFileService-service';
import { searchQueryService } from '../services/searchQuery-service';
import { createSessionService } from '../services/createSession-service';


const createUser = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { email, password, role, mobile_number, country_code } = req.body;

        const userDetails = {
            email,
            password,
            profile_role: role,
            mobile_number,
            country_code
        };

        const user = await UserModel.create(userDetails);

        if (role === 'job_seeker') {
            const job = await JobSeekerModel.create({
                user: user._id
            });
            console.log(job)
        } else if (role === 'employer') {
            const emp = await EmployerModel.create({
                user: user._id
            });
            console.log(emp)
        }

        const session = await UserSessionModel.create({
            user: user._id,
            ip_address: req.socket.remoteAddress,
            agent: req.get('User-Agent'),
            active: true
        });

        const JWT_TOKEN = createToken(session._id);

        res.set({
            'x-access': JWT_TOKEN,
            'x-refresh': JWT_TOKEN
        });

        res.status(201).json({ body: { message: "User Created Successfully" } });

    } catch (error) {
        res.status(400).json({ body: { message: error.message } });
    }
};


const createSessionHandler = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { email, password, role, mobile } = req.body
        console.log(req.body)
        // apply for 
        // const user = await UserModel.findOne({ $or: [ {email: key.email}, {mobile_number: key.mobile } ]});
        let user : IUserDocument
        if (email) {
            user = await UserModel.findOne({ email })
        } else if (mobile) {
            user = await UserModel.findOne({ mobile_number: mobile })
        } else {
            res.status(400).json({ body: { message: "Enter credentials" } })
            return
        }
        if (user !== null && await bcrypt.compare(password, user.password) && user.profile_role === role) {
            const {JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH} = await createSessionService(user._id, req)
            res.set({
                'x-access-token': JWT_TOKEN_ACCESS,
                'x-refresh-token': JWT_TOKEN_REFRESH
            });
            res.status(201).json({ body: { message: "User LoggedIn Successfully" } })
        } else {
            res.status(400).json({ body: { message: "Invalid login credentials" } })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ body: { message: error.message } })
    }
}

const forgotPassword = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { email } = req.query as { email: string }
        if (!(email)) {
            res.status(400).json({ body: { message: "Enter email" } });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ body: { message: "Reset link sent to if email exit" } });
            return;
        }
        const JWT_TOKEN = createToken(email);
        const link = 'http://localhost:1337' + '/change-password/' + JWT_TOKEN;
        nodeMailFunc(email, link);
        res.status(400).json({ body: { message: "Reset link sent to if email exit" } });
    } catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
}

const changePassword = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { password } = req.body as { password: string }   
        if (!(password)) {
            res.status(400).json({ body: { message: "Enter password" } });
        }
        const { token } = req.params as { token: string }
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY) as decodedToken
        const user = await UserModel.findOne({ email: decodedToken });
        user.password = password;
        await user.save();
        res.status(200).json({ body: { message: "Password changed successfully" } });

    } catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
}


const deleteSession = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        
        // Find session document by ID
        const sessionId = req.user._id; // Assuming you have the user ID available
        const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId)

        if(!IUserSessionDocument.active) {
            res.status(400).json({ body: { message: "User already logged out" } })
            return 
        }
        // how to expire jwt token
        IUserSessionDocument.active = false;
        IUserSessionDocument.expire_at = new Date(Date.now())
        await IUserSessionDocument.save();

        res.status(200).json({ body: { message: 'User logged out successfully' } })
    } catch (error) {
        res.status(500).json({ body: { message: "Logging Out unsuccessfull" } })
    }
}

const getUserDetailHandler = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId as string
        const sessionId: string | undefined = req.user?._id; // Assuming you have the user ID available
        const user = await getUserDetailService(userId, sessionId)
        res.status(200).json({ body: { data: user } })
    } catch (error) {
        res.status
    }
}

const updateProfileImageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const sessionId = req.user._id; // Assuming you have the user ID available
        const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId)
        if(!IUserSessionDocument.active) {
            res.status(400).json({ body: { message: "Not Authorized" } })
            return;
        }
        const userId = IUserSessionDocument.user.toString()

        const file_path = req.file?.filename
        const media_type = req.file?.mimetype

        // Set the file path where you want to save the uploaded photo
        await uploadFileService(userId, file_path, media_type)
        
        res.status(200).json({ data: { path: `images/${file_path}` } })
    } catch (error) {
        res.status(500).json({ data: { path: '' } })
    }
}

const searchQueryHandler = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.params as { role: "employer" | "job_seeker"}
        const { search } = req.query as { search: string }

        const data = await searchQueryService(role, search)
        res.status(200).json({data})
    } catch (error) {
        res.status(200).json({data: error.message})
    }
}

export {
    createUser,
    createSessionHandler,
    forgotPassword,
    changePassword,
    deleteSession,
    getUserDetailHandler,
    updateProfileImageHandler,
    searchQueryHandler
}