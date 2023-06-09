import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { CustomRequest, decodedToken } from "../interfaces/interfaces";
import createAccessToken from "./create-access-token";
import UserSessionModel from "../models/userSession-model";
import UserModel from "../models/user-model";
import env from "../utils/validateEnv";

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];

  const hasBearerToken =
    authorizationHeader && authorizationHeader.startsWith("Bearer ");

  // Extract the token if the "Bearer " prefix is present, otherwise set it to null
  const accessToken = hasBearerToken
    ? authorizationHeader.replace("Bearer ", "")
    : null;
  const refreshToken = req.headers["x-refresh"] as string;
  if (accessToken) {
    try {
      const verifiedAccessToken = jsonwebtoken.verify(
        accessToken,
        env.TOKEN_HEADER_KEY
      ) as decodedToken;
      const sessionId = await UserSessionModel.findById(
        verifiedAccessToken._id
      );
      if (!sessionId.active) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await UserModel.findById(sessionId.user);
      req.user = user;
      req.sessionId = sessionId;
    } catch (accessTokenError) {
      if (accessTokenError.name === "TokenExpiredError" && refreshToken) {
        try {
          const verifiedRefreshToken = jsonwebtoken.verify(
            refreshToken,
            env.TOKEN_HEADER_KEY
          ) as decodedToken;
          const JWT_TOKEN_ACCESS = createAccessToken(verifiedRefreshToken._id);
          res.set({
            "x-access": JWT_TOKEN_ACCESS,
          });
          const sessionId = await UserSessionModel.findById(
            verifiedRefreshToken._id
          );
          if (!sessionId.active) {
            return res.status(401).json({ message: "Not authenticated" });
          }
          const user = await UserModel.findById(sessionId.user);
          req.user = user;
          req.sessionId = sessionId;
        } catch (refreshTokenError) {
          if (refreshTokenError.name === "TokenExpiredError") {
            const decodedToken = jsonwebtoken.decode(
              refreshTokenError
            ) as decodedToken;
            if (decodedToken) {
              await UserSessionModel.findByIdAndUpdate(decodedToken._id, {
                active: false,
                deleted: true,
              });
            }
            return res.status(401).json({ message: "Refresh token expired" });
          }
          return res.status(500).json({ message: "Internal server error" });
        }
      } else {
        const decodedToken = jsonwebtoken.decode(accessToken) as decodedToken;
        if (decodedToken) {
          await UserSessionModel.findByIdAndUpdate(
            decodedToken._id,
            { active: false, deleted: true },
            { new: true }
          );
        }
        return res.status(401).json({ message: "Access token expired" });
      }
    }
  }
  next();
};
