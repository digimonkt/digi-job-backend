import { NextFunction, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { CustomRequest } from '../interfaces/interfaces';

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers['x-access-token'] as string;
  const refreshToken = req.headers['x-refresh-token'] as string;
  if (accessToken) {
    const verified = jsonwebtoken.verify(accessToken, process.env.TOKEN_HEADER_KEY);
    req.user = verified;
    next();
  } else if (refreshToken) {
    const verified = jsonwebtoken.verify(refreshToken, process.env.TOKEN_HEADER_KEY);
    req.user = verified;
    next();
  } else {
    return res.status(401).json({ status: "error", message: "Access Denied" });
  }
};

