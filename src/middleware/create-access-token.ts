import jwt from 'jsonwebtoken';
import env from '../utils/validateEnv';


const createAccessToken = (_id: string): string => {

    // const userpower= md5(User_Type);
    const maxAge = 3 * 24 * 60 * 60;
    const Token = jwt.sign({ _id }, env.TOKEN_HEADER_KEY, {
        expiresIn: maxAge
    });
    return Token;
}

export default createAccessToken;
