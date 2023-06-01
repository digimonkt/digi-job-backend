import { NextFunction, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { CustomRequest, decodedToken } from '../interfaces/interfaces';
import createAccessToken from './create-access-token';


export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization'] as string;
  const refreshToken = req.headers['x-refresh'] as string;

  if (accessToken) {
    try {
      const verifiedAccessToken = jsonwebtoken.verify(accessToken.split(' ')[1], process.env.TOKEN_HEADER_KEY) as decodedToken
      req.user = verifiedAccessToken._id;
      next();
    } catch (accessTokenError) {
      if (accessTokenError.name === 'TokenExpiredError' && refreshToken) {
        try {
          const verifiedRefreshToken = jsonwebtoken.verify(refreshToken.split(' ')[1], process.env.TOKEN_HEADER_KEY) as decodedToken;
          req.user = verifiedRefreshToken._id;
          const JWT_TOKEN_ACCESS = createAccessToken(verifiedRefreshToken._id);
          res.set({
            'x-access': JWT_TOKEN_ACCESS
          })
          next();
        } catch (refreshTokenError) {
          if (refreshTokenError.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
          }
          return res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        return res.status(401).json({ message: 'Access token expired' });
      }
    }
  }
  next();
};