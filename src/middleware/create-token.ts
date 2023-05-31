import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const createtoken = (_id: string): string => {

    // const userpower= md5(User_Type);
    const maxAge = 3 * 24 * 60 * 60;
    const Token = jwt.sign({ _id }, process.env.TOKEN_HEADER_KEY, {
        expiresIn: maxAge
    });

    return Token;
}

export default createtoken;
