import { NextFunction, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { CustomRequest, decodedToken } from '../interfaces/interfaces';


export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers['x-access-token'] as string
  const refreshToken = req.headers['x-refresh-token'] as string
  if (accessToken) {
    const verified = jsonwebtoken.verify(accessToken, process.env.TOKEN_HEADER_KEY) as decodedToken
    req.user = verified
  } else if (refreshToken) {
    try {
      const verified = jsonwebtoken.verify(refreshToken, process.env.TOKEN_HEADER_KEY) as decodedToken
      req.user = verified
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Refresh token expired' })
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  next()
};

