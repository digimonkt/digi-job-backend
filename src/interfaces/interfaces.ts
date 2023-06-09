import mongoose from "mongoose";
import { Request } from "express";
import { profile_role } from "../models/user-model";
export interface Ijobseekerskill {
  skill: string;
  user: mongoose.Schema.Types.ObjectId;
}

export interface IjobCategory {
  title: string;
  slug: string;
  active: boolean;
}

export interface decodedToken {
  _id: string;
  ext: number;
  iat: number;
}
export interface CustomRequest extends Request {
  user?: any;
  files: any;
  query: any;
  sessionId: any;
}

export interface CustomRequestBody<P, Q, T>
  extends Omit<Request, "query" | "params"> {
  user?: any;
  files: any;
  query: Q;
  sessionId: string;
  body: T;
  params: P;
}

export interface CreateUserRequestType {
  email: string;
  password: string | number;
  role: profile_role;
  mobile_number: string;
  country_code: string;
}

export interface LoginRequestType {
  email: string;
  password: string | number;
  role: profile_role;
}

export interface RequestParamsType {
  email: string;
}

export interface ChangePasswordParams {
  token: string;
}

export interface ChangePasswordBodyType {
  password: string;
}

export interface searchParamsType {
  role: "employer" | "job_seeker";
}

export interface searchQueryType {
  search: string;
}
