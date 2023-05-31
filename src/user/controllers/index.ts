
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CustomRequest } from '../../interfaces/interfaces';
import UserModel from '../../models/user-model';
import UserSessionModel, { IUserSessionDocument } from '../../models/userSession-model';
import JobSeekerModel from '../../models/jobSeeker-model';
import EmployerModel from '../../models/employer-model';


import { nodeMailFunc } from '../../utils/node-mailer'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import createToken from '../../middleware/create-token';
import { getUserDetailService } from '../services/getUsersDetail-service';
import MediaModel from '../../models/media-model';
import { uploadFileService } from '../services/uploadFileService-service';

interface Ikey {
    email: string,
    mobile: string
}

const createUser = async (req: Request, res: Response): Promise<void> => {
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
            await JobSeekerModel.create({
                user: user._id
            });
        } else if (role === 'employer') {
            await EmployerModel.create({
                user: user._id
            });
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


const createSession = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { email, password, role, mobile } = req.body
        console.log(req.body)
        // apply for 
        // const user = await UserModel.findOne({ $or: [ {email: key.email}, {mobile_number: key.mobile } ]});
        let user
        if (email) {
            user = await UserModel.findOne({ email })
        } else if (mobile) {
            user = await UserModel.findOne({ mobile_number: mobile })
        } else {
            res.status(400).json({ body: { message: "Enter credentials" } })
            return
        }
        console.log(user)
        console.log(user !== null, await bcrypt.compare(password, user.password), user.profile_role === role)
        if (user !== null && await bcrypt.compare(password, user.password) && user.profile_role === role) {
            // console.log(JWT_TOKEN)
            console.log(user)
            const session = await UserSessionModel.create({
                user: user._id,
                ip_address: req.socket.remoteAddress,
                agent: req.get('User-Agent'),
                active: true
            })
            const JWT_TOKEN = createToken(session._id);
            res.set({
                'x-access': JWT_TOKEN,
                'x-refresh': JWT_TOKEN
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
        const { password } = req.body

        if (!(password)) {
            res.status(400).json({ body: { message: "Enter password" } });
        }
        const { token } = req.params as { token: string }
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY)
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

        const token = req.headers['x-access-token']
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY);
        const uesr = req.user
        console.log(decodedToken)
        const sessionId = decodedToken._id;

        // Find session document by ID
        const session: IUserSessionDocument | null = await UserSessionModel.findById(sessionId);

        if (!session) {
            res.status(404).json({ body: { message: 'Session not found' } });
            return;
        }

        session.active = false;
        session.expire_at = new Date(Date.now())
        await session.save();

        res.status(200).json({ body: { message: 'User logged out successfully' } })
    } catch (error) {
        res.status(500).json({ body: { message: "Logging Out unsuccessfull" } })
    }
}

const getUserDetailHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId as string
        const token = req.headers['x-access-token'] as string
        const user = await getUserDetailService(userId, token)
        console.log(user)
        res.status(200).json({ body: { data: user } })
    } catch (error) {
        res.status
    }
}

const updateProfileImageHandler = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const sessionId = req.user._id; // Assuming you have the user ID available
        const IUserSessionDocument: IUserSessionDocument = await UserSessionModel.findById(sessionId).select('user')
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
    } catch (error) {
        res.status(200).json({data: error.message})
    }
}

export {
    createUser,
    createSession,
    forgotPassword,
    changePassword,
    deleteSession,
    getUserDetailHandler,
    updateProfileImageHandler,
    searchQueryHandler
}