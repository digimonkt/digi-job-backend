import { Request, Response } from 'express';

import UserModel from '../../models/user-model';
import UserSessionModel, { IUserSessionDocument } from '../../models/userSession-model';
import JobSeekerModel from '../../models/jobSeeker-model';
import EmployerModel from '../../models/employer-model';


import { nodeMailFunc } from '../../utils/node-mailer'
import bcrypt from 'bcrypt';
import verifyToken from '../../middleware/verify-token';
import jsonwebtoken from 'jsonwebtoken';
import createToken from '../../middleware/create-token';

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


const createSession = async (req: Request, res: Response): Promise<void> => {
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

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query as { email: string }
        if (!(email)) {
            res.status(400).json({ body: { message: "Enter email" } });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ body: { message: "User not found" } });
            return;
        }
        const JWT_TOKEN = createToken(email);
        const link = 'http://localhost:1337' + '/change-password/' + JWT_TOKEN;
        nodeMailFunc(email, link);
        res.status(400).json({ body: { message: `Reset link sent to ${email}` } });
    } catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
}

const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body

        if (!(password)) {
            res.status(400).json({ body: { message: "Enter password" } });
        }
        const { token } = req.params as {token: string}
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY)
        const user = await UserModel.findOne({ email: decodedToken });
        user.password = password;
        await user.save();
        res.status(200).json({ body: { message: "Password changed successfully" } });

    } catch (error) {
        res.status(500).json({ body: { message: "Enter email" } });
    }
}


const deleteSession = async (req: Request, res: Response): Promise<void> => {
    try {

        const token = req.headers['x-access-token']
        const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY);
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

        // Blacklist token
        // You can store the blacklisted token in a database or cache
        // and check it on subsequent requests to ensure that the token is not reused

        res.status(200).json({ body: { message: 'User logged out successfully' } })
    } catch (error) {
        res.status(500).json({ body: { message: "Logging Out unsuccessfull" } })
    }
}

// const getUserDetail = async (req: Request, res: Response): Promise<void> => {
//     try {
//         let userId = req.params.userId as string
//         if(userId === null) {
//             const { token } = req.params as { token: string | null };
//             const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY);
//             const session = await UserSessionModel.findById(decodedToken._id);
//             userId = session?.user.toString() as string;
//         }
//         const user = await UserModel.findById(userId);
        
//     } catch (error) {

//     }
// }

export {
    createUser,
    createSession,
    forgotPassword,
    changePassword,
    deleteSession,
    getUserDetail
}