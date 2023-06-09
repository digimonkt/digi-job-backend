import { Response } from "express";
import { CustomRequest, decodedToken } from "../../interfaces/interfaces";
import UserModel, { IUserDocument } from "../../models/user-model";
import UserSessionModel, {
  IUserSessionDocument,
} from "../../models/userSession-model";

import { nodeMailFunc } from "../../utils/node-mailer";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import createToken from "../../middleware/create-refresh-token";
import { getUserDetailService } from "../services/getUsersDetail-service";
import { uploadFileService } from "../services/uploadFileService-service";
import { searchQueryService } from "../services/searchQuery-service";
import { createSessionService } from "../services/createSession-service";
import { sendOTPService } from "../services/sentOTP-service";
import { OTPVerificationService } from "../services/verifyOTP-service";
import { createUserService } from "../services/createUser-service";
import {
  authSchema,
  loginSchema,
  querySchema,
  verificationSchema,
} from "../../utils/validators";
import env from "../../utils/validateEnv";
const createUserHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, role, mobile_number, country_code } = req.body;
    await authSchema.validateAsync(req.body);
    const isExist = await UserModel.findOne({ email });
    if (isExist) {
      res.status(403).json({ message: "Email Already Exists" });
      return;
    }
    const { JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH } = await createUserService(
      email,
      password,
      role,
      mobile_number,
      country_code,
      req
    );
    res.set({
      "x-access": JWT_TOKEN_ACCESS,
      "x-refresh": JWT_TOKEN_REFRESH,
    });
    res.status(201).json({ body: { message: "User Created Successfully" } });
  } catch (error) {
    res.status(400).json({ body: { message: error.message } });
  }
};

const createSessionHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    await loginSchema.validateAsync(req.body);
    // apply for
    // const user = await UserModel.findOne({ $or: [ {email: key.email}, {mobile_number: key.mobile } ]});
    let user: IUserDocument;
    if (email) {
      user = await UserModel.findOne({ email });
    } else {
      res.status(400).json({ body: { message: "Enter credentials" } });
    }
    if (
      user !== null &&
      (await bcrypt.compare(password, user.password)) &&
      user.profile_role === role
    ) {
      const { JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH } =
        await createSessionService(user._id, req);
      res.setHeader("x-access", JWT_TOKEN_ACCESS);
      res.setHeader("x-refresh", JWT_TOKEN_REFRESH);
      res.status(201).json({ body: { message: "User LoggedIn Successfully" } });
    } else {
      res.status(400).json({ body: { message: "Invalid login credentials" } });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ body: { message: error.message } });
  }
};

const forgotPassword = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params as { email: string };
    console.log({ email });
    await querySchema.validateAsync({ email });
    if (!email) {
      res.status(400).json({ body: { message: "Enter email" } });
      return;
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ body: { message: "Reset link sent to if email exist" } });
      return;
    }
    const JWT_TOKEN = createToken(email);
    const link = "http://localhost:1337" + "/change-password/" + JWT_TOKEN;
    const subject = "Reset Password";
    const text = "Reset Password  " + link;
    nodeMailFunc(email, subject, text);
    res
      .status(400)
      .json({ body: { message: "Reset link sent to if email exist" } });
  } catch (error) {
    res.status(500).json({ body: { message: "Enter email" } });
  }
};

const changePasswordHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body as { password: string };
    if (!password) {
      res.status(400).json({ body: { message: "Enter password" } });
      return;
    }
    const { token } = req.params as { token: string };
    const decodedToken = jsonwebtoken.verify(
      token,
      process.env.TOKEN_HEADER_KEY
    ) as decodedToken;
    const user = await UserModel.findOne({ email: decodedToken });
    user.password = password;
    await user.save();
    res
      .status(200)
      .json({ body: { message: "Password changed successfully" } });
  } catch (error) {
    res.status(500).json({ body: { message: "Enter email" } });
  }
};

const deleteSessionHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    // Find session document by ID
    const sessionId = req.sessionId; // Assuming you have the user ID available
    const IUserSessionDocument: IUserSessionDocument =
      await UserSessionModel.findById(sessionId);

    if (!IUserSessionDocument.active) {
      res.status(400).json({ body: { message: "Invalid Session" } });
      return;
    }
    // how to expire jwt token
    IUserSessionDocument.active = false;
    IUserSessionDocument.expire_at = new Date(Date.now());
    await IUserSessionDocument.save();

    res.status(200).json({ body: { message: "User logged out successfully" } });
  } catch (error) {
    res.status(500).json({ body: { message: error.message } });
  }
};

const getUserDetailHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id;
    const user = await getUserDetailService(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateProfileImageHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id as string;
    const file_path = req.file?.filename;
    const media_type = req.file?.mimetype;

    // Set the file path where you want to save the uploaded photo
    await uploadFileService(userId, file_path, media_type);
    res.status(200).json({ data: { path: `images/${file_path}` } });
  } catch (error) {
    res.status(500).json({ data: { path: "" } });
  }
};

const searchQueryHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.params as { role: "employer" | "job_seeker" };
    const { search } = req.query as { search: string };
    const data = await searchQueryService(role, search);
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

const sendOTPHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params as { email: string };
    await verificationSchema.validateAsync({ email });
    if (!email) {
      res.status(400).json({ body: { message: "Enter email" } });
      return;
    }
    const results = await sendOTPService(email);
    res
      .status(400)
      .json({ body: { message: results.message, token: results.token } });
  } catch (error) {
    res.status(500).json({ body: { message: error.message } });
  }
};

const OTPVerificationHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query as { token: string };
    const { otp } = req.params as { otp: string };
    await verificationSchema.validateAsync({ otp });
    if (!otp) {
      res.status(400).json({ body: { message: "Enter valid OTP" } });
      return;
    }
    const verifyToken = jsonwebtoken.verify(
      token,
      env.TOKEN_HEADER_KEY
    ) as decodedToken;
    const results = await OTPVerificationService(verifyToken._id, otp, req);
    res.status(400).json({ body: { token: results.JWT_TOKEN_ACCESS } });
  } catch (error) {
    res.status(500).json({ body: { message: error.message } });
  }
};

export {
  createUserHandler,
  createSessionHandler,
  forgotPassword,
  changePasswordHandler,
  deleteSessionHandler,
  getUserDetailHandler,
  updateProfileImageHandler,
  searchQueryHandler,
  sendOTPHandler,
  OTPVerificationHandler,
};
